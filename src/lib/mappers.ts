import type { Course, CourseLesson, Database, ValidationRule } from './database.types';

type CourseRow = Database['public']['Tables']['courses']['Row'];
type CourseLessonRow = Database['public']['Tables']['course_lessons']['Row'];

/**
 * Row -> app type for courses. The JSON columns (curriculum, prerequisites,
 * learning_objectives) come back from Postgres as untyped `Json`; this is the
 * one place they're given the shapes the UI expects.
 */
export function toCourse(row: CourseRow): Course {
  return {
    ...row,
    curriculum: row.curriculum as Course['curriculum'],
    prerequisites: Array.isArray(row.prerequisites) ? (row.prerequisites as string[]) : [],
    learning_objectives: Array.isArray(row.learning_objectives)
      ? (row.learning_objectives as string[])
      : [],
  };
}

/** Row -> app type for lessons; `validation_rules` is a JSON column. */
export function toCourseLesson(row: CourseLessonRow): CourseLesson {
  return {
    ...row,
    validation_rules: row.validation_rules as ValidationRule | null,
  };
}
