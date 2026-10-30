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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      client_documents: {
        Row: {
          category: string
          content_type: string | null
          created_at: string
          file_name: string
          id: string
          lead_id: string
          notes: string | null
          owner_id: string
          status: string
          storage_path: string
        }
        Insert: {
          category?: string
          content_type?: string | null
          created_at?: string
          file_name: string
          id?: string
          lead_id: string
          notes?: string | null
          owner_id: string
          status?: string
          storage_path: string
        }
        Update: {
          category?: string
          content_type?: string | null
          created_at?: string
          file_name?: string
          id?: string
          lead_id?: string
          notes?: string | null
          owner_id?: string
          status?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          contact: string | null
          created_at: string
          expected_return: number | null
          id: string
          investment_amount: number | null
          investment_horizon: string | null
          name: string
          notes: string | null
          objective: string | null
          owner_id: string
          profile: string | null
          risk_profile: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          expected_return?: number | null
          id?: string
          investment_amount?: number | null
          investment_horizon?: string | null
          name: string
          notes?: string | null
          objective?: string | null
          owner_id: string
          profile?: string | null
          risk_profile?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          expected_return?: number | null
          id?: string
          investment_amount?: number | null
          investment_horizon?: string | null
          name?: string
          notes?: string | null
          objective?: string | null
          owner_id?: string
          profile?: string | null
          risk_profile?: string | null
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          due_at: string | null
          id: string
          lead_id: string
          owner_id: string
        }
        Insert: {
          activity_type?: string
          created_at?: string
          description: string
          due_at?: string | null
          id?: string
          lead_id: string
          owner_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          due_at?: string | null
          id?: string
          lead_id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_simulations: {
        Row: { id: string; investor_id: string; owner_id: string; title: string; principal: number; annual_rate: number; months: number; estimated_value: number; created_at: string }
        Insert: { id?: string; investor_id: string; owner_id: string; title: string; principal: number; annual_rate: number; months: number; estimated_value: number; created_at?: string }
        Update: { id?: string; investor_id?: string; owner_id?: string; title?: string; principal?: number; annual_rate?: number; months?: number; estimated_value?: number; created_at?: string }
        Relationships: [{ foreignKeyName: "investor_simulations_investor_id_fkey"; columns: ["investor_id"]; isOneToOne: false; referencedRelation: "investors"; referencedColumns: ["id"] }]
      }
      lead_proposals: {
        Row: { id: string; lead_id: string; owner_id: string; title: string; product_type: string; amount: number | null; monthly_payment: number | null; status: string; details: Json; created_at: string; updated_at: string }
        Insert: { id?: string; lead_id: string; owner_id: string; title: string; product_type: string; amount?: number | null; monthly_payment?: number | null; status?: string; details?: Json; created_at?: string; updated_at?: string }
        Update: { id?: string; lead_id?: string; owner_id?: string; title?: string; product_type?: string; amount?: number | null; monthly_payment?: number | null; status?: string; details?: Json; created_at?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "lead_proposals_lead_id_fkey"; columns: ["lead_id"]; isOneToOne: false; referencedRelation: "leads"; referencedColumns: ["id"] }]
      }
      leads: {
        Row: {
          commission_value: number | null
          commission_rate: number
          commission_installments: number
          commission_paid_amount: number
          closed_at: string | null
          last_contact_at: string | null
          address: string | null
          birth_date: string | null
          city: string | null
          cpf_cnpj: string | null
          credit_notes: string | null
          credit_profile: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          full_name: string
          id: string
          notes: string | null
          objective: string | null
          owner_id: string
          phone: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          commission_value?: number | null
          commission_rate?: number
          commission_installments?: number
          commission_paid_amount?: number
          closed_at?: string | null
          last_contact_at?: string | null
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          credit_notes?: string | null
          credit_profile?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          full_name: string
          id?: string
          notes?: string | null
          objective?: string | null
          owner_id: string
          phone: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          commission_value?: number | null
          commission_rate?: number
          commission_installments?: number
          commission_paid_amount?: number
          closed_at?: string | null
          last_contact_at?: string | null
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          credit_notes?: string | null
          credit_profile?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          full_name?: string
          id?: string
          notes?: string | null
          objective?: string | null
          owner_id?: string
          phone?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          administration_fee: number | null
          category: string | null
          company: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
          reserve_fund: number | null
          term_months: number | null
          website: string | null
        }
        Insert: {
          administration_fee?: number | null
          category?: string | null
          company?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          reserve_fund?: number | null
          term_months?: number | null
          website?: string | null
        }
        Update: {
          administration_fee?: number | null
          category?: string | null
          company?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          reserve_fund?: number | null
          term_months?: number | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      simulations: {
        Row: {
          created_at: string
          details: Json
          id: string
          lead_id: string
          owner_id: string
          product_type: string
          requested_amount: number | null
          status: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          lead_id: string
          owner_id: string
          product_type: string
          requested_amount?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          lead_id?: string
          owner_id?: string
          product_type?: string
          requested_amount?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_crm_admin: { Args: never; Returns: boolean }
      receive_public_lead: { Args: { p_name: string; p_phone: string; p_city: string; p_objective: string; p_estimated_value?: number | null; p_consent?: boolean }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
