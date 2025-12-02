import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, Save, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useCourseManagement, CreateModuleData, CreateLessonData } from '../hooks/useCourseManagement';

export default function CourseBuilder() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { isAdminOrInstructor, loading: roleLoading } = useUserRole();
  const { courseDetails, loading: courseLoading } = useCourseDetails(courseId === 'new' ? undefined : courseId);
  const { createCourse, updateCourse, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson, loading: saving } = useCourseManagement();
  const navigate = useNavigate();

  const isNewCourse = courseId === 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [durationHours, setDurationHours] = useState(10);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['']);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '', estimated_minutes: 60, learning_objectives: [''] });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    estimated_minutes: 15,
    content_type: 'reading' as 'video' | 'reading' | 'exercise' | 'quiz',
    content_url: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!roleLoading && !isAdminOrInstructor) {
      navigate('/dashboard');
    }
  }, [user, isAdminOrInstructor, roleLoading, navigate]);

  useEffect(() => {
    if (courseDetails && !isNewCourse) {
      setTitle(courseDetails.title);
      setDescription(courseDetails.description || '');
      setDifficulty(courseDetails.difficulty);
      setDurationHours(courseDetails.duration_hours);
      setLearningObjectives(courseDetails.learning_objectives || ['']);
      setPrerequisites(courseDetails.prerequisites || []);
    }
  }, [courseDetails, isNewCourse]);

  if (!user || roleLoading || (courseLoading && !isNewCourse)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminOrInstructor) {
    return null;
  }

  const handleSaveCourse = async () => {
    if (!title.trim()) {
      alert('Please enter a course title');
      return;
    }

    try {
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        duration_hours: durationHours,
        learning_objectives: learningObjectives.filter(obj => obj.trim() !== ''),
        prerequisites: prerequisites.filter(pre => pre.trim() !== ''),
      };

      if (isNewCourse) {
        const newCourse = await createCourse(courseData);
        if (newCourse) {
          alert('Course created successfully!');
          navigate(`/admin/courses/${newCourse.id}/edit`);
        }
      } else if (courseId) {
        await updateCourse(courseId, courseData);
        alert('Course updated successfully!');
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error saving course:', err);
      }
      alert('Failed to save course. Please try again.');
    }
  };

  const handleAddModule = async () => {
    if (!courseId || isNewCourse) {
      alert('Please save the course first before adding modules');
      return;
    }

    if (!newModule.title.trim()) {
      alert('Please enter a module title');
      return;
    }

    try {
      const moduleData: CreateModuleData = {
        course_id: courseId,
        title: newModule.title.trim(),
        description: newModule.description.trim(),
        order_index: courseDetails?.modules.length || 0,
        estimated_minutes: newModule.estimated_minutes,
        learning_objectives: newModule.learning_objectives.filter(obj => obj.trim() !== ''),
      };

      await createModule(moduleData);
      setShowAddModule(false);
      setNewModule({ title: '', description: '', estimated_minutes: 60, learning_objectives: [''] });
      window.location.reload();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error adding module:', err);
      }
      alert('Failed to add module. Please try again.');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) {
      return;
    }

    try {
      await deleteModule(moduleId);
      window.location.reload();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error deleting module:', err);
      }
      alert('Failed to delete module. Please try again.');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title.trim()) {
      alert('Please enter a lesson title');
      return;
    }

    try {
      const module = courseDetails?.modules.find(m => m.id === moduleId);
      const lessonData: CreateLessonData = {
        module_id: moduleId,
        title: newLesson.title.trim(),
        description: newLesson.description.trim(),
        order_index: module?.lessons.length || 0,
        estimated_minutes: newLesson.estimated_minutes,
        content_type: newLesson.content_type,
        content_url: newLesson.content_url.trim() || undefined,
      };

      await createLesson(lessonData);
      setShowAddLesson(null);
      setNewLesson({ title: '', description: '', estimated_minutes: 15, content_type: 'reading', content_url: '' });
      window.location.reload();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error adding lesson:', err);
      }
      alert('Failed to add lesson. Please try again.');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      window.location.reload();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error deleting lesson:', err);
      }
      alert('Failed to delete lesson. Please try again.');
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn Admin
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isNewCourse ? 'Create New Course' : 'Edit Course'}
          </h1>
          <p className="text-gray-600">
            {isNewCourse ? 'Add course information and content structure' : 'Update course information and manage content'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Java Fundamentals for Beginners"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what students will learn in this course..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Objectives</label>
              {learningObjectives.map((obj, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const newObjectives = [...learningObjectives];
                      newObjectives[index] = e.target.value;
                      setLearningObjectives(newObjectives);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What will students learn?"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => setLearningObjectives(learningObjectives.filter((_, i) => i !== index))}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setLearningObjectives([...learningObjectives, ''])}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Objective
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveCourse}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : isNewCourse ? 'Create Course' : 'Update Course'}
              </button>
            </div>
          </div>
        </div>

        {!isNewCourse && courseDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <button
                onClick={() => setShowAddModule(!showAddModule)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Module
              </button>
            </div>

            {showAddModule && (
              <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4">New Module</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Module title"
                  />
                  <textarea
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Module description"
                  />
                  <input
                    type="number"
                    value={newModule.estimated_minutes}
                    onChange={(e) => setNewModule({ ...newModule, estimated_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Estimated minutes"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddModule}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      {saving ? 'Adding...' : 'Add Module'}
                    </button>
                    <button
                      onClick={() => setShowAddModule(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {courseDetails.modules.map((module, idx) => {
                const isExpanded = expandedModules.has(module.id);

                return (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <span className="font-bold text-gray-900">Module {idx + 1}: {module.title}</span>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-600 mb-4">{module.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Lessons ({module.lessons.length})</h4>
                          <button
                            onClick={() => setShowAddLesson(showAddLesson === module.id ? null : module.id)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Lesson
                          </button>
                        </div>

                        {showAddLesson === module.id && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={newLesson.title}
                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Lesson title"
                              />
                              <textarea
                                value={newLesson.description}
                                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Lesson description"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <select
                                  value={newLesson.content_type}
                                  onChange={(e) => setNewLesson({ ...newLesson, content_type: e.target.value as any })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                  <option value="video">Video</option>
                                  <option value="reading">Reading</option>
                                  <option value="exercise">Exercise</option>
                                  <option value="quiz">Quiz</option>
                                </select>
                                <input
                                  type="number"
                                  value={newLesson.estimated_minutes}
                                  onChange={(e) => setNewLesson({ ...newLesson, estimated_minutes: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="Minutes"
                                />
                              </div>
                              <input
                                type="text"
                                value={newLesson.content_url}
                                onChange={(e) => setNewLesson({ ...newLesson, content_url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Content URL (optional)"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddLesson(module.id)}
                                  disabled={saving}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-sm"
                                >
                                  {saving ? 'Adding...' : 'Add Lesson'}
                                </button>
                                <button
                                  onClick={() => setShowAddLesson(null)}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIdx) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{lessonIdx + 1}. {lesson.title}</div>
                                <div className="text-sm text-gray-600">{lesson.content_type} • {lesson.estimated_minutes} min</div>
                              </div>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {courseDetails.modules.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No modules added yet</p>
                <button
                  onClick={() => setShowAddModule(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Add your first module
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
