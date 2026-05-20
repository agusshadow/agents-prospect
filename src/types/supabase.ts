// GENERADO AUTOMÁTICAMENTE — no editar a mano
// Regenerar con: npx supabase gen types --lang=typescript --project-id <project-id> > src/types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          system_prompt: string;
          llm_provider: string;
          llm_model: string;
          llm_config: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          system_prompt: string;
          llm_provider: string;
          llm_model: string;
          llm_config?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          system_prompt?: string;
          llm_provider?: string;
          llm_model?: string;
          llm_config?: Json;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      runs: {
        Row: {
          id: string;
          agent_id: string;
          status: string;
          input_context: Json | null;
          output: Json | null;
          error_message: string | null;
          started_at: string | null;
          finished_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          status?: string;
          input_context?: Json | null;
          output?: Json | null;
          error_message?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          output?: Json | null;
          error_message?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "runs_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
        ];
      };
      run_logs: {
        Row: {
          id: string;
          run_id: string;
          level: string;
          message: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          level: string;
          message: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "run_logs_run_id_fkey";
            columns: ["run_id"];
            isOneToOne: false;
            referencedRelation: "runs";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
