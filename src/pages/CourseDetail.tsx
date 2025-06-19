import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Award, Download } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useCourse } from '../contexts/CourseContext';
import TestComponent from '../components/TestComponent';
import VideoPlayer from '../components/VideoPlayer';
import CertificateGenerator from '../components/CertificateGenerator';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useAdmin();
  const { getProgress, setCurrentCourse, getCertificate } = useCourse();
  
  const course = courses.find(c => c.id === courseId);
  const progress = courseId ? getProgress(courseId) : undefined;
  const certificate = courseId ? getCertificate(courseId) : undefined;
  
  const [currentStep, setCurrentStep] = useState<'overview' | 'pretest' | 'video' | 'posttest' | 'complete'>('overview');
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  
  useEffect(() => {
    if (course) {
      setCurrentCourse(course);
    }
  }, [course, setCurrentCourse]);
  
  useEffect(() => {
    if (progress) {
      if (progress.completed) {
        setCurrentStep('complete');
      } else if (progress.postTestCompleted) {
        setCurrentStep('complete');
      } else if (progress.videoWatched) {
        setCurrentStep('posttest');
      } else if (progress.preTestCompleted) {
        setCurrentStep('video');
      } else {
        setCurrentStep('pretest');
      }
    }
  }, [progress]);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบคอร์สที่ต้องการ</h2>
          <button
            onClick={() => navigate('/classroom')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            กลับไปห้องเรียน
          </button>
        </div>
      </div>
    );
  }
  
  const steps = [
    { id: 'pretest', label: 'ทดสอบก่อนเรียน', completed: progress?.preTestCompleted || false },
    { id: 'video', label: 'ดูวิดีโอ', completed: progress?.videoWatched || false },
    { id: 'posttest', label: 'ทดสอบหลังเรียน', completed: progress?.postTestCompleted || false }
  ];
  
  const getStepNumber = (stepId: string) => {
    return steps.findIndex(step => step.id === stepId) + 1;
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>ระยะเวลา: {course.duration}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>หมวดหมู่: {course.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="w-4 h-4 mr-2" />
                <span>คะแนนผ่าน: {course.passingScore}%</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>ข้อสอบ: {course.preTest.length + course.postTest.length} ข้อ</span>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">ขั้นตอนการเรียน</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : <span>{index + 1}</span>}
                    </div>
                    <span className={step.completed ? 'text-green-600 font-medium' : 'text-gray-600'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('pretest')}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              เริ่มเรียน
            </button>
          </div>
        );
        
      case 'pretest':
        return (
          <TestComponent
            course={course}
            testType="pre"
            onComplete={() => setCurrentStep('video')}
            onBack={() => setCurrentStep('overview')}
          />
        );
        
      case 'video':
        return (
          <VideoPlayer
            course={course}
            onComplete={() => setCurrentStep('posttest')}
            onBack={() => setCurrentStep('pretest')}
          />
        );
        
      case 'posttest':
        return (
          <TestComponent
            course={course}
            testType="post"
            onComplete={() => setCurrentStep('complete')}
            onBack={() => setCurrentStep('video')}
          />
        );
        
      case 'complete':
        const postTestPercentage = progress ? Math.round((progress.postTestScore / course.postTest.length) * 100) : 0;
        const passed = postTestPercentage >= course.passingScore;
        
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <CheckCircle className={`w-8 h-8 ${passed ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {passed ? 'ยินดีด้วย! เรียนจบแล้ว' : 'เสร็จสิ้นการเรียน'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {passed 
                ? `คุณได้เรียนจบคอร์ส "${course.title}" เรียบร้อยแล้ว และผ่านเกณฑ์การประเมิน`
                : `คุณได้เรียนจบคอร์ส "${course.title}" แล้ว แต่ยังไม่ผ่านเกณฑ์การประเมิน`
              }
            </p>
            
            {progress && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">สรุปผลการเรียน</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {progress.preTestScore}/{course.preTest.length}
                    </div>
                    <div className="text-gray-600">ทดสอบก่อนเรียน</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {progress.postTestScore}/{course.postTest.length}
                    </div>
                    <div className="text-gray-600">ทดสอบหลังเรียน</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className={`text-lg font-semibold ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    คะแนนรวม: {postTestPercentage}% 
                    {passed ? ' (ผ่าน)' : ` (ไม่ผ่าน - ต้องได้ ${course.passingScore}% ขึ้นไป)`}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/classroom')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
              >
                กลับไปห้องเรียน
              </button>
              
              {passed ? (
                <button
                  onClick={() => setShowCertificateGenerator(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <Award className="w-5 h-5 mr-2" />
                  {certificate ? 'ดูใบประกาศนียบัตร' : 'รับใบประกาศนียบัตร'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep('posttest')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  ทำแบบทดสอบใหม่
                </button>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/classroom')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            กลับ
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">
              {currentStep === 'overview' ? 'ภาพรวมหลักสูตร' : 
               currentStep === 'complete' ? 'เสร็จสิ้น' :
               `ขั้นตอนที่ ${getStepNumber(currentStep)} จาก 3`}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        {currentStep !== 'overview' && currentStep !== 'complete' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed ? 'bg-green-500 text-white' : 
                    currentStep === step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Content */}
        {renderStepContent()}
        
        {/* Certificate Generator Modal */}
        {showCertificateGenerator && courseId && (
          <CertificateGenerator
            courseId={courseId}
            onClose={() => setShowCertificateGenerator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetail;