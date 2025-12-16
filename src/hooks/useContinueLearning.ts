import { useEffect, useState } from 'react';
import { CourseLesson, CourseWithDetails } from '../lib/database.types';
import { useModuleProgress } from './useModuleProgress';

export function useContinueLearning(courseDetails: CourseWithDetails | null, enrollmentId?: string) {
  const { lessonProgress } = useModuleProgress(enrollmentId);
  const [nextLesson, setNextLesson] = useState<CourseLesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseDetails) {
      setNextLesson(null);
      setLoading(false);
      return;
    }

    const allLessons: CourseLesson[] = [];

    for (const module of courseDetails.modules) {
      for (const lesson of module.lessons) {
        allLessons.push(lesson);
      }
    }

    if (allLessons.length === 0) {
      setNextLesson(null);
      setLoading(false);
      return;
    }

    let firstIncompleteLesson: CourseLesson | null = null;

    for (const lesson of allLessons) {
      const progress = lessonProgress.find(p => p.lesson_id === lesson.id);
      if (!progress || !progress.completed) {
        firstIncompleteLesson = lesson;
        break;
      }
    }

    if (firstIncompleteLesson) {
      setNextLesson(firstIncompleteLesson);
    } else {
      setNextLesson(allLessons[0]);
    }

    setLoading(false);
  }, [courseDetails, lessonProgress]);

  return {
    nextLesson,
    loading,
  };
}
