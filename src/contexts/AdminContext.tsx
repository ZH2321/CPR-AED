import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: string;
  preTest: Question[];
  postTest: Question[];
  isActive: boolean;
  certificateTemplate?: string;
  passingScore: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
}

interface AdminContextType {
  courses: Course[];
  articles: Article[];
  certificateTemplates: CertificateTemplate[];
  loading: boolean;
  error: string | null;
  setCourses: (courses: Course[]) => void;
  setArticles: (articles: Article[]) => void;
  setCertificateTemplates: (templates: CertificateTemplate[]) => void;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addCertificateTemplate: (template: CertificateTemplate) => void;
  deleteCertificateTemplate: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>([]);
  
  const {
    loading,
    error,
    fetchCourses,
    fetchCourseQuestions,
    createCourse,
    updateCourse: updateCourseDB,
    deleteCourse: deleteCourseDB,
    fetchArticles,
    createArticle,
    updateArticle: updateArticleDB,
    deleteArticle: deleteArticleDB,
    fetchCertificateTemplates,
  } = useSupabase();

  // Transform database course to app course format
  const transformCourse = async (dbCourse: Tables['courses']['Row']): Promise<Course> => {
    const questions = await fetchCourseQuestions(dbCourse.id);
    
    const preTest = questions
      .filter(q => q.type === 'pre')
      .map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options as string[] : [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      }));

    const postTest = questions
      .filter(q => q.type === 'post')
      .map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options as string[] : [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      }));

    return {
      id: dbCourse.id,
      title: dbCourse.title,
      description: dbCourse.description,
      videoUrl: dbCourse.video_url,
      duration: dbCourse.duration,
      category: dbCourse.category,
      isActive: dbCourse.is_active,
      passingScore: dbCourse.passing_score,
      preTest,
      postTest,
    };
  };

  // Transform database article to app article format
  const transformArticle = (dbArticle: Tables['articles']['Row']): Article => ({
    id: dbArticle.id,
    title: dbArticle.title,
    excerpt: dbArticle.excerpt,
    content: dbArticle.content,
    category: dbArticle.category,
    author: dbArticle.author,
    readTime: dbArticle.read_time,
    image: dbArticle.image,
    isPublished: dbArticle.is_published,
    createdAt: dbArticle.created_at.split('T')[0],
  });

  // Transform database certificate template to app format
  const transformCertificateTemplate = (dbTemplate: Tables['certificate_templates']['Row']): CertificateTemplate => ({
    id: dbTemplate.id,
    name: dbTemplate.name,
    imageUrl: dbTemplate.image_url,
    isDefault: dbTemplate.is_default,
  });

  // Load data from Supabase
  const refreshData = async () => {
    try {
      // Fetch courses
      const dbCourses = await fetchCourses();
      const transformedCourses = await Promise.all(
        dbCourses.map(course => transformCourse(course))
      );
      setCourses(transformedCourses);

      // Fetch articles
      const dbArticles = await fetchArticles();
      const transformedArticles = dbArticles.map(transformArticle);
      setArticles(transformedArticles);

      // Fetch certificate templates
      const dbTemplates = await fetchCertificateTemplates();
      const transformedTemplates = dbTemplates.map(transformCertificateTemplate);
      setCertificateTemplates(transformedTemplates);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const addCourse = async (course: Course) => {
    const dbCourse: Tables['courses']['Insert'] = {
      title: course.title,
      description: course.description,
      video_url: course.videoUrl,
      duration: course.duration,
      category: course.category,
      is_active: course.isActive,
      passing_score: course.passingScore,
    };

    const newCourse = await createCourse(dbCourse);
    if (newCourse) {
      await refreshData();
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const dbUpdates: Tables['courses']['Update'] = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.passingScore !== undefined) dbUpdates.passing_score = updates.passingScore;

    const updatedCourse = await updateCourseDB(id, dbUpdates);
    if (updatedCourse) {
      await refreshData();
    }
  };

  const deleteCourse = async (id: string) => {
    const success = await deleteCourseDB(id);
    if (success) {
      await refreshData();
    }
  };

  const addArticle = async (article: Article) => {
    const dbArticle: Tables['articles']['Insert'] = {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      read_time: article.readTime,
      image: article.image,
      is_published: article.isPublished,
    };

    const newArticle = await createArticle(dbArticle);
    if (newArticle) {
      await refreshData();
    }
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    const dbUpdates: Tables['articles']['Update'] = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.readTime !== undefined) dbUpdates.read_time = updates.readTime;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;

    const updatedArticle = await updateArticleDB(id, dbUpdates);
    if (updatedArticle) {
      await refreshData();
    }
  };

  const deleteArticle = async (id: string) => {
    const success = await deleteArticleDB(id);
    if (success) {
      await refreshData();
    }
  };

  const addCertificateTemplate = (template: CertificateTemplate) => {
    setCertificateTemplates(prev => [...prev, template]);
  };

  const deleteCertificateTemplate = (id: string) => {
    setCertificateTemplates(prev => prev.filter(template => template.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      courses,
      articles,
      certificateTemplates,
      loading,
      error,
      setCourses,
      setArticles,
      setCertificateTemplates,
      addCourse,
      updateCourse,
      deleteCourse,
      addArticle,
      updateArticle,
      deleteArticle,
      addCertificateTemplate,
      deleteCertificateTemplate,
      refreshData,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export type { Course, Question, Article, CertificateTemplate };