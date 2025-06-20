import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, Clock, Users, Award, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { useCourse } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const Classroom: React.FC = () => {
  const { t } = useLanguage();
  const { courses } = useAdmin();
  const { getProgress } = useCourse();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const activeCourses = courses.filter(course => course.isActive);
  
  const getProgressIcon = (courseId: string) => {
    if (!user) return <Lock className="w-5 h-5 text-gray-400" />;
    
    const progress = getProgress(courseId);
    if (!progress) return <BookOpen className="w-5 h-5 text-gray-400" />;
    if (progress.completed) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (progress.preTestCompleted || progress.videoWatched) return <Play className="w-5 h-5 text-blue-500" />;
    return <BookOpen className="w-5 h-5 text-gray-400" />;
  };
  
  const getProgressText = (courseId: string) => {
    if (!user) return 'เข้าสู่ระบบเพื่อเรียน';
    
    const progress = getProgress(courseId);
    if (!progress) return 'ยังไม่เริ่ม';
    if (progress.completed) return 'เสร็จสิ้น';
    if (progress.postTestCompleted) return 'รอผลการทดสอบ';
    if (progress.videoWatched) return 'ดูวิดีโอแล้ว';
    if (progress.preTestCompleted) return 'ทดสอบก่อนเรียนแล้ว';
    return 'กำลังเรียน';
  };
  
  const getProgressPercentage = (courseId: string) => {
    if (!user) return 0;
    
    const progress = getProgress(courseId);
    if (!progress) return 0;
    
    let completed = 0;
    if (progress.preTestCompleted) completed += 33;
    if (progress.videoWatched) completed += 33;
    if (progress.postTestCompleted) completed += 34;
    
    return completed;
  };

  const handleCourseClick = (courseId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Navigation will be handled by Link component
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('classroom_title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เรียนรู้เทคนิคการช่วยชีวิตผ่านคอร์สออนไลน์ที่ครบครัน พร้อมการทดสอบและใบประกาศนียบัตร
            </p>
            {!user && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-800">
                  <Lock className="w-4 h-4 inline mr-1" />
                  เข้าสู่ระบบเพื่อเข้าถึงคอร์สเรียนและติดตามความคืบหน้า
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeCourses.length}</h3>
              <p className="text-gray-600">คอร์สที่เปิดให้เรียน</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,234</h3>
              <p className="text-gray-600">ผู้เรียนทั้งหมด</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">892</h3>
              <p className="text-gray-600">ใบประกาศนียบัตรที่ออก</p>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getProgressIcon(course.id)}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {getProgressText(course.id)}
                      </span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  {user && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>ความคืบหน้า</span>
                        <span>{getProgressPercentage(course.id)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(course.id)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {user ? (
                    <Link
                      to={`/course/${course.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {getProgress(course.id)?.completed ? 'ทบทวน' : 'เริ่มเรียน'}
                      <Play className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCourseClick(course.id)}
                      className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      เข้าสู่ระบบเพื่อเรียน
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* No Courses */}
          {activeCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยังไม่มีคอร์สที่เปิดให้เรียน
              </h3>
              <p className="text-gray-500">
                คอร์สใหม่จะเปิดให้เรียนเร็วๆ นี้
              </p>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Classroom;