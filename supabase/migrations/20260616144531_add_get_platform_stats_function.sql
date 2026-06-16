CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_users bigint;
  v_avg_rating numeric;
  v_completion_rate numeric;
  v_total_enrollments bigint;
  v_completed_enrollments bigint;
BEGIN
  SELECT COUNT(*) INTO v_total_users FROM profiles;

  SELECT COALESCE(ROUND(AVG(rating), 1), 0)
  INTO v_avg_rating
  FROM courses
  WHERE rating IS NOT NULL AND rating > 0;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_enrollments, v_completed_enrollments
  FROM course_enrollments;

  IF v_total_enrollments > 0 THEN
    v_completion_rate := ROUND((v_completed_enrollments::numeric / v_total_enrollments) * 100);
  ELSE
    v_completion_rate := 0;
  END IF;

  RETURN json_build_object(
    'total_users', v_total_users,
    'avg_rating', v_avg_rating,
    'completion_rate', v_completion_rate
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_platform_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_platform_stats() TO authenticated;