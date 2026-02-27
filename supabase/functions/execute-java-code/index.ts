import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExecuteCodeRequest {
  code: string;
  lessonId: string;
  enrollmentId?: string;
}

interface TestCase {
  id: string;
  test_case_number: number;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
  points: number;
  timeout_seconds: number;
}

interface TestResult {
  testNumber: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isHidden: boolean;
  points: number;
  executionTime: number;
  error?: string;
}

interface ExecutionResult {
  success: boolean;
  submissionId?: string;
  executionStatus: string;
  compilationErrors?: string;
  testResults: TestResult[];
  passedAllTests: boolean;
  totalPoints: number;
  earnedPoints: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  xpAwarded: number;
  alreadyCompleted: boolean;
  stdout?: string;
  stderr?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid authentication token");
    }

    // Parse request
    const { code, lessonId, enrollmentId }: ExecuteCodeRequest = await req.json();

    if (!code || !lessonId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: code, lessonId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check rate limit
    const { data: canSubmit } = await supabase.rpc("check_rate_limit", {
      p_user_id: user.id,
    });

    if (!canSubmit) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Maximum 20 submissions per hour.",
          rateLimitExceeded: true
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get test cases for this lesson
    const { data: testCases, error: testCasesError } = await supabase.rpc(
      "get_lesson_test_cases",
      {
        p_lesson_id: lessonId,
        p_user_id: user.id,
      }
    ) as { data: TestCase[] | null; error: any };

    if (testCasesError || !testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No test cases found for this lesson. Please contact an administrator.",
          noTestCases: true
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get lesson execution settings
    const { data: lesson } = await supabase
      .from("course_lessons")
      .select("max_execution_time, max_memory_mb")
      .eq("id", lessonId)
      .single();

    const maxExecutionTime = lesson?.max_execution_time || 5;
    const maxMemoryMb = lesson?.max_memory_mb || 512;

    // Execute code with test cases
    const executionResult = await executeJavaCode(
      code,
      testCases,
      maxExecutionTime,
      maxMemoryMb
    );

    // Record submission in database
    const { data: submissionData } = await supabase.rpc("record_code_submission", {
      p_user_id: user.id,
      p_lesson_id: lessonId,
      p_enrollment_id: enrollmentId || null,
      p_submitted_code: code,
      p_execution_status: executionResult.executionStatus,
      p_compilation_errors: executionResult.compilationErrors || null,
      p_stdout: executionResult.stdout || null,
      p_stderr: executionResult.stderr || null,
      p_execution_time_ms: executionResult.executionTimeMs,
      p_memory_used_kb: executionResult.memoryUsedKb,
      p_test_results: executionResult.testResults,
      p_passed_all_tests: executionResult.passedAllTests,
    });

    // Add submission info to result
    const result: ExecutionResult = {
      ...executionResult,
      submissionId: submissionData?.submission_id,
      xpAwarded: submissionData?.xp_awarded || 0,
      alreadyCompleted: submissionData?.already_completed || false,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function executeJavaCode(
  code: string,
  testCases: TestCase[],
  maxExecutionTime: number,
  maxMemoryMb: number
): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Security check: scan for dangerous patterns
  const dangerousPatterns = [
    /Runtime\.exec/i,
    /ProcessBuilder/i,
    /System\.exit/i,
    /java\.io\.File(?!.*println)/i, // Allow println but not File operations
    /java\.nio\.file/i,
    /java\.net/i,
    /reflect/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        success: false,
        executionStatus: "security_violation",
        compilationErrors: `Security violation: Code contains prohibited pattern: ${pattern.source}`,
        testResults: [],
        passedAllTests: false,
        totalPoints: 0,
        earnedPoints: 0,
        executionTimeMs: 0,
        memoryUsedKb: 0,
        xpAwarded: 0,
        alreadyCompleted: false,
      };
    }
  }

  // Extract class name from code
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classNameMatch) {
    return {
      success: false,
      executionStatus: "compilation_error",
      compilationErrors: "No public class found in code. Java code must contain a public class.",
      testResults: [],
      passedAllTests: false,
      totalPoints: 0,
      earnedPoints: 0,
      executionTimeMs: 0,
      memoryUsedKb: 0,
      xpAwarded: 0,
      alreadyCompleted: false,
    };
  }

  const className = classNameMatch[1];
  const fileName = `${className}.java`;

  // Create temporary directory
  const tempDir = await Deno.makeTempDir();
  const javaFilePath = `${tempDir}/${fileName}`;

  try {
    // Write code to file
    await Deno.writeTextFile(javaFilePath, code);

    // Compile Java code
    const compileCommand = new Deno.Command("javac", {
      args: [fileName],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const compileProcess = compileCommand.spawn();
    const compileOutput = await compileProcess.output();
    const compileStderr = new TextDecoder().decode(compileOutput.stderr);

    if (!compileOutput.success) {
      return {
        success: false,
        executionStatus: "compilation_error",
        compilationErrors: compileStderr,
        testResults: [],
        passedAllTests: false,
        totalPoints: 0,
        earnedPoints: 0,
        executionTimeMs: Date.now() - startTime,
        memoryUsedKb: 0,
        xpAwarded: 0,
        alreadyCompleted: false,
      };
    }

    // Run test cases
    const testResults: TestResult[] = [];
    let totalPoints = 0;
    let earnedPoints = 0;
    let totalExecutionTime = 0;

    for (const testCase of testCases) {
      totalPoints += testCase.points;
      const testStartTime = Date.now();

      try {
        // Create input file if needed
        const inputData = testCase.input_data;
        const hasInput = inputData && inputData !== "[Hidden]" && inputData.trim().length > 0;

        let runCommand;
        if (hasInput) {
          const inputFilePath = `${tempDir}/input.txt`;
          await Deno.writeTextFile(inputFilePath, inputData);

          // Run with input redirection
          runCommand = new Deno.Command("sh", {
            args: ["-c", `java -Xmx${maxMemoryMb}m ${className} < input.txt`],
            cwd: tempDir,
            stdout: "piped",
            stderr: "piped",
          });
        } else {
          runCommand = new Deno.Command("java", {
            args: [`-Xmx${maxMemoryMb}m`, className],
            cwd: tempDir,
            stdout: "piped",
            stderr: "piped",
          });
        }

        // Execute with timeout
        const runProcess = runCommand.spawn();
        const timeoutId = setTimeout(() => {
          runProcess.kill("SIGKILL");
        }, testCase.timeout_seconds * 1000);

        const runOutput = await runProcess.output();
        clearTimeout(timeoutId);

        const testExecutionTime = Date.now() - testStartTime;
        totalExecutionTime += testExecutionTime;

        const stdout = new TextDecoder().decode(runOutput.stdout).trim();
        const stderr = new TextDecoder().decode(runOutput.stderr).trim();

        // Normalize output for comparison (trim whitespace, normalize line endings)
        const normalizedActual = stdout.replace(/\r\n/g, "\n").trim();
        const normalizedExpected = testCase.expected_output.replace(/\r\n/g, "\n").trim();

        const passed = normalizedActual === normalizedExpected && runOutput.success;

        if (passed) {
          earnedPoints += testCase.points;
        }

        testResults.push({
          testNumber: testCase.test_case_number,
          passed,
          input: testCase.is_hidden ? "[Hidden]" : inputData,
          expectedOutput: testCase.is_hidden ? "[Hidden]" : testCase.expected_output,
          actualOutput: testCase.is_hidden && !passed ? "[Run all tests to see]" : stdout,
          isHidden: testCase.is_hidden,
          points: testCase.points,
          executionTime: testExecutionTime,
          error: stderr || undefined,
        });
      } catch (error) {
        testResults.push({
          testNumber: testCase.test_case_number,
          passed: false,
          input: testCase.is_hidden ? "[Hidden]" : testCase.input_data,
          expectedOutput: testCase.is_hidden ? "[Hidden]" : testCase.expected_output,
          actualOutput: "",
          isHidden: testCase.is_hidden,
          points: testCase.points,
          executionTime: Date.now() - testStartTime,
          error: `Execution error: ${error.message}`,
        });
      }
    }

    const passedAllTests = earnedPoints === totalPoints;

    return {
      success: true,
      executionStatus: "success",
      testResults,
      passedAllTests,
      totalPoints,
      earnedPoints,
      executionTimeMs: totalExecutionTime,
      memoryUsedKb: 0, // TODO: Implement memory tracking
      xpAwarded: 0, // Will be set by record_code_submission
      alreadyCompleted: false,
    };
  } catch (error) {
    return {
      success: false,
      executionStatus: "runtime_error",
      compilationErrors: undefined,
      testResults: [],
      passedAllTests: false,
      totalPoints: 0,
      earnedPoints: 0,
      executionTimeMs: Date.now() - startTime,
      memoryUsedKb: 0,
      xpAwarded: 0,
      alreadyCompleted: false,
      stderr: error.message,
    };
  } finally {
    // Cleanup temporary directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}
