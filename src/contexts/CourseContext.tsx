import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Question } from './AdminContext';
import { useAuth } from './AuthContext';
import { useSupabase } from '../hooks/useSupabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

interface CourseProgress {
  courseId: string;
  preTestCompleted: boolean;
  preTestScore: number;
  videoWatched: boolean;
  postTestCompleted: boolean;
  postTestScore: number;
  completed: boolean;
  completedAt?: string;
  certificateGenerated: boolean;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
  percentage: number;
  passed: boolean;
}

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completedAt: string;
  score: number;
  totalScore: number;
  percentage: number;
  certificateNumber: string;
}

interface CourseContextType {
  progress: CourseProgress[];
  currentCourse: Course | null;
  currentTest: Question[] | null;
  testType: 'pre' | 'post' | null;
  testResult: TestResult | null;
  certificates: Certificate[];
  studentName: string;
  setStudentName: (name: string) => void;
  setCurrentCourse: (course: Course | null) => void;
  startTest: (course: Course, type: 'pre' | 'post') => void;
  submitTest: (answers: { questionId: string; selectedAnswer: number }[]) => void;
  markVideoWatched: (courseId: string) => void;
  getProgress: (courseId: string) => CourseProgress | undefined;
  resetTest: () => void;
  generateCertificate: (courseId: string) => Certificate | null;
  getCertificate: (courseId: string) => Certificate | undefined;
  refreshProgress: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentTest, setCurrentTest] = useState<Question[] | null>(null);
  const [testType, setTestType] = useState<'pre' | 'post' | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [studentName, setStudentName] = useState<string>('');

  const { user } = useAuth();
  const {
    fetchUserProgress,
    upsertUserProgress,
    fetchUserCertificates,
    createCertificate,
  } = useSupabase();

  // Transform database progress to app format
  const transformProgress = (dbProgress: Tables['user_progress']['Row']): CourseProgress => ({
    courseId: dbProgress.course_id,
    preTestCompleted: dbProgress.pre_test_completed,
    preTestScore: dbProgress.pre_test_score,
    videoWatched: dbProgress.video_watched,
    postTestCompleted: dbProgress.post_test_completed,
    postTestScore: dbProgress.post_test_score,
    completed: dbProgress.completed,
    completedAt: dbProgress.completed_at || undefined,
    certificateGenerated: dbProgress.certificate_generated,
  });

  // Transform database certificate to app format
  const transformCertificate = (dbCert: Tables['certificates']['Row']): Certificate => ({
    id: dbCert.id,
    courseId: dbCert.course_id,
    courseName: dbCert.course_name,
    studentName: dbCert.student_name,
    completedAt: dbCert.completed_at,
    score: dbCert.score,
    totalScore: dbCert.total_score,
    percentage: dbCert.percentage,
    certificateNumber: dbCert.certificate_number,
  });

  // Load user progress and certificates
  const refreshProgress = async () => {
    if (!user) return;

    try {
      // Fetch progress
      const dbProgress = await fetchUserProgress(user.id);
      const transformedProgress = dbProgress.map(transformProgress);
      setProgress(transformedProgress);

      // Fetch certificates
      const dbCertificates = await fetchUserCertificates(user.id);
      const transformedCertificates = dbCertificates.map(transformCertificate);
      setCertificates(transformedCertificates);
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshProgress();
    } else {
      setProgress([]);
      setCertificates([]);
    }
  }, [user]);

  const getProgress = (courseId: string): CourseProgress | undefined => {
    return progress.find(p => p.courseId === courseId);
  };

  const updateProgress = async (courseId: string, updates: Partial<CourseProgress>) => {
    if (!user) return;

    const currentProgress = getProgress(courseId);
    const newProgress = {
      ...currentProgress,
      ...updates,
      courseId,
    };

    // Update local state
    setProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId);
      if (existing) {
        return prev.map(p => p.courseId === courseId ? newProgress : p);
      } else {
        return [...prev, newProgress];
      }
    });

    // Update database
    const dbProgress: Tables['user_progress']['Insert'] = {
      user_id: user.id,
      course_id: courseId,
      pre_test_completed: newProgress.preTestCompleted,
      pre_test_score: newProgress.preTestScore,
      video_watched: newProgress.videoWatched,
      post_test_completed: newProgress.postTestCompleted,
      post_test_score: newProgress.postTestScore,
      completed: newProgress.completed,
      completed_at: newProgress.completedAt || null,
      certificate_generated: newProgress.certificateGenerated,
    };

    await upsertUserProgress(dbProgress);
  };

  const startTest = (course: Course, type: 'pre' | 'post') => {
    setCurrentCourse(course);
    setCurrentTest(type === 'pre' ? course.preTest : course.postTest);
    setTestType(type);
    setTestResult(null);
  };

  const submitTest = async (answers: { questionId: string; selectedAnswer: number }[]) => {
    if (!currentTest || !currentCourse || !testType) return;

    const results = answers.map(answer => {
      const question = currentTest.find(q => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correct: question ? question.correctAnswer === answer.selectedAnswer : false
      };
    });

    const score = results.filter(r => r.correct).length;
    const percentage = Math.round((score / currentTest.length) * 100);
    const passed = percentage >= currentCourse.passingScore;

    const testResult: TestResult = {
      score,
      totalQuestions: currentTest.length,
      answers: results,
      percentage,
      passed
    };

    setTestResult(testResult);

    // Update progress
    const updates: Partial<CourseProgress> = {};
    if (testType === 'pre') {
      updates.preTestCompleted = true;
      updates.preTestScore = score;
    } else {
      updates.postTestCompleted = true;
      updates.postTestScore = score;
      
      // Check if course is completed
      const currentProgress = getProgress(currentCourse.id);
      if (currentProgress?.preTestCompleted && currentProgress?.videoWatched && passed) {
        updates.completed = true;
        updates.completedAt = new Date().toISOString();
      }
    }

    await updateProgress(currentCourse.id, updates);
  };

  const markVideoWatched = async (courseId: string) => {
    await updateProgress(courseId, { videoWatched: true });
  };

  const resetTest = () => {
    setCurrentTest(null);
    setTestType(null);
    setTestResult(null);
  };

  const generateCertificateNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CPR-${timestamp.slice(-6)}-${random}`;
  };

  const generateCertificate = async (courseId: string): Promise<Certificate | null> => {
    if (!user) return null;

    const courseProgress = getProgress(courseId);
    const course = currentCourse;
    
    if (!courseProgress?.completed || !course || !studentName.trim()) {
      return null;
    }

    // Check if certificate already exists
    const existingCertificate = certificates.find(cert => cert.courseId === courseId);
    if (existingCertificate) {
      return existingCertificate;
    }

    const certificate: Certificate = {
      id: Date.now().toString(),
      courseId,
      courseName: course.title,
      studentName: studentName.trim(),
      completedAt: courseProgress.completedAt || new Date().toISOString(),
      score: courseProgress.postTestScore,
      totalScore: course.postTest.length,
      percentage: Math.round((courseProgress.postTestScore / course.postTest.length) * 100),
      certificateNumber: generateCertificateNumber()
    };

    // Save to database
    const dbCertificate: Tables['certificates']['Insert'] = {
      user_id: user.id,
      course_id: certificate.courseId,
      course_name: certificate.courseName,
      student_name: certificate.studentName,
      completed_at: certificate.completedAt,
      score: certificate.score,
      total_score: certificate.totalScore,
      percentage: certificate.percentage,
      certificate_number: certificate.certificateNumber,
    };

    const savedCertificate = await createCertificate(dbCertificate);
    if (savedCertificate) {
      const transformedCert = transformCertificate(savedCertificate);
      setCertificates(prev => [...prev, transformedCert]);
      await updateProgress(courseId, { certificateGenerated: true });
      return transformedCert;
    }

    return null;
  };

  const getCertificate = (courseId: string): Certificate | undefined => {
    return certificates.find(cert => cert.courseId === courseId);
  };

  return (
    <CourseContext.Provider value={{
      progress,
      currentCourse,
      currentTest,
      testType,
      testResult,
      certificates,
      studentName,
      setStudentName,
      setCurrentCourse,
      startTest,
      submitTest,
      markVideoWatched,
      getProgress,
      resetTest,
      generateCertificate,
      getCertificate,
      refreshProgress,
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};