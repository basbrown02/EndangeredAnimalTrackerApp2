export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Minimal Supabase schema for the MVP.
 * Replace with the generated types from Supabase via `supabase gen types`.
 */
export interface Database {
  public: {
    Tables: {
      project_submissions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          student_name: string | null;
          class_name: string | null;
          species_slug: string;
          math_inputs: Json;
          narrative_inputs: Json;
          score: number;
          tipping_point_label: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          student_name?: string | null;
          class_name?: string | null;
          species_slug: string;
          math_inputs: Json;
          narrative_inputs: Json;
          score: number;
          tipping_point_label: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          student_name?: string | null;
          class_name?: string | null;
          species_slug?: string;
          math_inputs?: Json;
          narrative_inputs?: Json;
          score?: number;
          tipping_point_label?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
