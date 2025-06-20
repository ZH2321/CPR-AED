import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Supabase error:', error);
    setError(error.message || 'An error occurred');
    setLoading(false);
  };

  const clearError = () => setError(null);

  // Courses
  const fetchCourses = async () => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const fetchCourseQuestions = async (courseId: string) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const createCourse = async (course: Tables['courses']['Insert']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const updateCourse = async (id: string, updates: Tables['courses']['Update']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const deleteCourse = async (id: string) => {
    setLoading(true);
    clearError();
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  // Articles
  const fetchArticles = async () => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const createArticle = async (article: Tables['articles']['Insert']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const updateArticle = async (id: string, updates: Tables['articles']['Update']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const deleteArticle = async (id: string) => {
    setLoading(true);
    clearError();
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  // User Progress
  const fetchUserProgress = async (userId: string) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const upsertUserProgress = async (progress: Tables['user_progress']['Insert']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progress, { 
          onConflict: 'user_id,course_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  // Certificates
  const fetchUserCertificates = async (userId: string) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const createCertificate = async (certificate: Tables['certificates']['Insert']) => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert(certificate)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  // Certificate Templates
  const fetchCertificateTemplates = async () => {
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('certificate_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  return {
    loading,
    error,
    clearError,
    // Courses
    fetchCourses,
    fetchCourseQuestions,
    createCourse,
    updateCourse,
    deleteCourse,
    // Articles
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    // User Progress
    fetchUserProgress,
    upsertUserProgress,
    // Certificates
    fetchUserCertificates,
    createCertificate,
    // Certificate Templates
    fetchCertificateTemplates,
  };
}