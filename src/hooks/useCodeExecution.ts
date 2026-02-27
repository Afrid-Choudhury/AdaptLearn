import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface TestResult {
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

export interface ExecutionResult {
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

export interface ExecutionError {
  error: string;
  rateLimitExceeded?: boolean;
  noTestCases?: boolean;
}

export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeCode = async (
    code: string,
    lessonId: string,
    enrollmentId?: string
  ): Promise<ExecutionResult | null> => {
    setIsExecuting(true);
    setError(null);
    setExecutionResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to execute code');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-java-code`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          lessonId,
          enrollmentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ExecutionError;

        if (errorData.rateLimitExceeded) {
          throw new Error('Rate limit exceeded. You can submit up to 20 attempts per hour. Please try again later.');
        }

        if (errorData.noTestCases) {
          throw new Error('This lesson does not have test cases configured yet. Please contact an instructor.');
        }

        throw new Error(errorData.error || 'Failed to execute code');
      }

      const result = data as ExecutionResult;
      setExecutionResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  const clearResults = () => {
    setExecutionResult(null);
    setError(null);
  };

  return {
    executeCode,
    isExecuting,
    executionResult,
    error,
    clearResults,
  };
}
