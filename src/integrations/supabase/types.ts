export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      book_submissions: {
        Row: {
          centre_id: string
          created_at: string
          custom_books: Json | null
          id: string
          month: string
          photo_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submission_type: string
          submitted_at: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          centre_id: string
          created_at?: string
          custom_books?: Json | null
          id?: string
          month?: string
          photo_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submission_type: string
          submitted_at?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          centre_id?: string
          created_at?: string
          custom_books?: Json | null
          id?: string
          month?: string
          photo_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submission_type?: string
          submitted_at?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_submissions_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      centres: {
        Row: {
          capacity: string | null
          created_at: string
          id: string
          name: string
          slots: string | null
          timings: string | null
        }
        Insert: {
          capacity?: string | null
          created_at?: string
          id?: string
          name: string
          slots?: string | null
          timings?: string | null
        }
        Update: {
          capacity?: string | null
          created_at?: string
          id?: string
          name?: string
          slots?: string | null
          timings?: string | null
        }
        Relationships: []
      }
      onboarding_completion: {
        Row: {
          centre_id: string
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          month: string
          section_key: string
          updated_at: string
        }
        Insert: {
          centre_id: string
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          month?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          centre_id?: string
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          month?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_completion_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          admin_approved: boolean | null
          admin_comment: string | null
          answer_text: string | null
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean | null
          is_mcq: boolean
          question_key: string
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string
        }
        Insert: {
          admin_approved?: boolean | null
          admin_comment?: string | null
          answer_text?: string | null
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          is_mcq?: boolean
          question_key: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Update: {
          admin_approved?: boolean | null
          admin_comment?: string | null
          answer_text?: string | null
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          is_mcq?: boolean
          question_key?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          admin_status: string
          attempt_number: number
          centre_id: string
          created_at: string
          educator_id: string
          id: string
          locked_at: string | null
          locked_reason: string | null
          mcq_score: number | null
          mcq_total: number | null
          onboarding_rating: number | null
          overall_status: string
          quiz_key: string
          started_at: string
          submitted_at: string | null
          taker_email: string | null
          taker_name: string | null
          timer_expires_at: string
          updated_at: string
        }
        Insert: {
          admin_status?: string
          attempt_number?: number
          centre_id: string
          created_at?: string
          educator_id: string
          id?: string
          locked_at?: string | null
          locked_reason?: string | null
          mcq_score?: number | null
          mcq_total?: number | null
          onboarding_rating?: number | null
          overall_status?: string
          quiz_key: string
          started_at?: string
          submitted_at?: string | null
          taker_email?: string | null
          taker_name?: string | null
          timer_expires_at?: string
          updated_at?: string
        }
        Update: {
          admin_status?: string
          attempt_number?: number
          centre_id?: string
          created_at?: string
          educator_id?: string
          id?: string
          locked_at?: string | null
          locked_reason?: string | null
          mcq_score?: number | null
          mcq_total?: number | null
          onboarding_rating?: number | null
          overall_status?: string
          quiz_key?: string
          started_at?: string
          submitted_at?: string | null
          taker_email?: string | null
          taker_name?: string | null
          timer_expires_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_unlock_logs: {
        Row: {
          action: string
          attempt_id: string
          comment: string | null
          created_at: string
          id: string
          unlocked_by: string
        }
        Insert: {
          action?: string
          attempt_id: string
          comment?: string | null
          created_at?: string
          id?: string
          unlocked_by: string
        }
        Update: {
          action?: string
          attempt_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          unlocked_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_unlock_logs_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      session_acknowledgments: {
        Row: {
          alternative_activity: string | null
          centre_id: string
          created_at: string
          id: string
          is_confirmed: boolean
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          session_id: string
          status: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          alternative_activity?: string | null
          centre_id: string
          created_at?: string
          id?: string
          is_confirmed?: boolean
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_id: string
          status?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          alternative_activity?: string | null
          centre_id?: string
          created_at?: string
          id?: string
          is_confirmed?: boolean
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          session_id?: string
          status?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_acknowledgments_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      session_images: {
        Row: {
          activity_key: string
          created_at: string
          id: string
          image_url: string
          session_name: string
        }
        Insert: {
          activity_key: string
          created_at?: string
          id?: string
          image_url: string
          session_name: string
        }
        Update: {
          activity_key?: string
          created_at?: string
          id?: string
          image_url?: string
          session_name?: string
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          centre_id: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          centre_id?: string | null
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          centre_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_profiles_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          centre_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          centre_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          centre_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_task_completions: {
        Row: {
          centre_id: string
          completed_at: string
          completed_by_user_id: string
          created_at: string
          date: string
          id: string
          optional_note: string | null
          optional_proof_link: string | null
          primary_teacher_name: string
          task_code: string
        }
        Insert: {
          centre_id: string
          completed_at?: string
          completed_by_user_id: string
          created_at?: string
          date: string
          id?: string
          optional_note?: string | null
          optional_proof_link?: string | null
          primary_teacher_name: string
          task_code: string
        }
        Update: {
          centre_id?: string
          completed_at?: string
          completed_by_user_id?: string
          created_at?: string
          date?: string
          id?: string
          optional_note?: string | null
          optional_proof_link?: string | null
          primary_teacher_name?: string
          task_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "wa_task_completions_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_task_definitions: {
        Row: {
          active: boolean
          created_at: string
          description: string
          due_rule: string
          id: string
          task_code: string
          task_name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          due_rule: string
          id?: string
          task_code: string
          task_name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          due_rule?: string
          id?: string
          task_code?: string
          task_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_staff_centre: { Args: { _user_id: string }; Returns: string }
      get_user_centre: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_staff_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "centre" | "cd" | "educator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "centre", "cd", "educator"],
    },
  },
} as const
