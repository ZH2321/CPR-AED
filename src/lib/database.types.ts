export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          gender: string | null
          age: number | null
          occupation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          gender?: string | null
          age?: number | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          gender?: string | null
          age?: number | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          video_url: string
          duration: string
          category: string
          is_active: boolean
          passing_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          video_url: string
          duration: string
          category: string
          is_active?: boolean
          passing_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          video_url?: string
          duration?: string
          category?: string
          is_active?: boolean
          passing_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          course_id: string
          type: 'pre' | 'post'
          question: string
          options: Json
          correct_answer: number
          explanation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          type: 'pre' | 'post'
          question: string
          options: Json
          correct_answer: number
          explanation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          type?: 'pre' | 'post'
          question?: string
          options?: Json
          correct_answer?: number
          explanation?: string
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          category: string
          author: string
          read_time: string
          image: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          category: string
          author: string
          read_time: string
          image: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          category?: string
          author?: string
          read_time?: string
          image?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          pre_test_completed: boolean
          pre_test_score: number
          video_watched: boolean
          post_test_completed: boolean
          post_test_score: number
          completed: boolean
          completed_at: string | null
          certificate_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          pre_test_completed?: boolean
          pre_test_score?: number
          video_watched?: boolean
          post_test_completed?: boolean
          post_test_score?: number
          completed?: boolean
          completed_at?: string | null
          certificate_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          pre_test_completed?: boolean
          pre_test_score?: number
          video_watched?: boolean
          post_test_completed?: boolean
          post_test_score?: number
          completed?: boolean
          completed_at?: string | null
          certificate_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          course_id: string
          course_name: string
          student_name: string
          completed_at: string
          score: number
          total_score: number
          percentage: number
          certificate_number: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          course_name: string
          student_name: string
          completed_at: string
          score: number
          total_score: number
          percentage: number
          certificate_number: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          course_name?: string
          student_name?: string
          completed_at?: string
          score?: number
          total_score?: number
          percentage?: number
          certificate_number?: string
          created_at?: string
        }
      }
      certificate_templates: {
        Row: {
          id: string
          name: string
          image_url: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}