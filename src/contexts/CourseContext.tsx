import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Question } from './AdminContext';

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

  const getProgress = (courseId: string): CourseProgress | undefined => {
    return progress.find(p => p.courseId === courseId);
  };

  const updateProgress = (courseId: string, updates: Partial<CourseProgress>) => {
    setProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId);
      if (existing) {
        return prev.map(p => p.courseId === courseId ? { ...p, ...updates } : p);
      } else {
        const newProgress: CourseProgress = {
          courseId,
          preTestCompleted: false,
          preTestScore: 0,
          videoWatched: false,
          postTestCompleted: false,
          postTestScore: 0,
          completed: false,
          certificateGenerated: false,
          ...updates
        };
        return [...prev, newProgress];
      }
    });
  };

  const startTest = (course: Course, type: 'pre' | 'post') => {
    setCurrentCourse(course);
    setCurrentTest(type === 'pre' ? course.preTest : course.postTest);
    setTestType(type);
    setTestResult(null);
  };

  const submitTest = (answers: { questionId: string; selectedAnswer: number }[]) => {
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

    updateProgress(currentCourse.id, updates);
  };

  const markVideoWatched = (courseId: string) => {
    updateProgress(courseId, { videoWatched: true });
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

  const generateCertificate = (courseId: string): Certificate | null => {
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

    setCertificates(prev => [...prev, certificate]);
    updateProgress(courseId, { certificateGenerated: true });

    return certificate;
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
      getCertificate
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