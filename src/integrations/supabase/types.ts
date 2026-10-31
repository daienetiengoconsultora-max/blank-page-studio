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
      consortium_administrators: {
        Row: {
          admin_fee: number | null
          city: string | null
          cnpj8: string | null
          created_at: string
          id: string
          name: string
          reference_period: string
          reserve_fund: number | null
          segment: string | null
          source: string
          source_url: string
          state: string | null
          term_months: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_fee?: number | null
          city?: string | null
          cnpj8?: string | null
          created_at?: string
          id?: string
          name: string
          reference_period: string
          reserve_fund?: number | null
          segment?: string | null
          source: string
          source_url: string
          state?: string | null
          term_months?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_fee?: number | null
          city?: string | null
          cnpj8?: string | null
          created_at?: string
          id?: string
          name?: string
          reference_period?: string
          reserve_fund?: number | null
          segment?: string | null
          source?: string
          source_url?: string
          state?: string | null
          term_months?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      investor_simulations: {
        Row: {
          annual_rate: number
          created_at: string
          estimated_value: number
          id: string
          investor_id: string
          months: number
          owner_id: string
          principal: number
          title: string
        }
        Insert: {
          annual_rate: number
          created_at?: string
          estimated_value: number
          id?: string
          investor_id: string
          months: number
          owner_id: string
          principal: number
          title: string
        }
        Update: {
          annual_rate?: number
          created_at?: string
          estimated_value?: number
          id?: string
          investor_id?: string
          months?: number
          owner_id?: string
          principal?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_simulations_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
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
      lead_proposals: {
        Row: {
          amount: number | null
          created_at: string
          details: Json
          id: string
          lead_id: string
          monthly_payment: number | null
          owner_id: string
          product_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          details?: Json
          id?: string
          lead_id: string
          monthly_payment?: number | null
          owner_id: string
          product_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          details?: Json
          id?: string
          lead_id?: string
          monthly_payment?: number | null
          owner_id?: string
          product_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          closed_at: string | null
          commission_installments: number
          commission_paid_amount: number
          commission_rate: number
          commission_value: number | null
          cpf_cnpj: string | null
          created_at: string
          credit_notes: string | null
          credit_profile: string | null
          email: string | null
          estimated_value: number | null
          full_name: string
          id: string
          last_contact_at: string | null
          notes: string | null
          objective: string | null
          owner_id: string
          phone: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          closed_at?: string | null
          commission_installments?: number
          commission_paid_amount?: number
          commission_rate?: number
          commission_value?: number | null
          cpf_cnpj?: string | null
          created_at?: string
          credit_notes?: string | null
          credit_profile?: string | null
          email?: string | null
          estimated_value?: number | null
          full_name: string
          id?: string
          last_contact_at?: string | null
          notes?: string | null
          objective?: string | null
          owner_id: string
          phone: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          closed_at?: string | null
          commission_installments?: number
          commission_paid_amount?: number
          commission_rate?: number
          commission_value?: number | null
          cpf_cnpj?: string | null
          created_at?: string
          credit_notes?: string | null
          credit_profile?: string | null
          email?: string | null
          estimated_value?: number | null
          full_name?: string
          id?: string
          last_contact_at?: string | null
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
      public_lead_rate_limits: {
        Row: {
          key_hash: string
          request_count: number
          updated_at: string
          window_started_at: string
        }
        Insert: {
          key_hash: string
          request_count?: number
          updated_at?: string
          window_started_at: string
        }
        Update: {
          key_hash?: string
          request_count?: number
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      public_submission_limits: {
        Row: {
          bucket_key: string
          request_count: number
          updated_at: string
          window_started_at: string
        }
        Insert: {
          bucket_key: string
          request_count?: number
          updated_at?: string
          window_started_at: string
        }
        Update: {
          bucket_key?: string
          request_count?: number
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      rate_references: {
        Row: {
          annual_rate: number
          category: string
          created_at: string
          id: string
          institution: string
          modality: string
          monthly_rate: number
          position: number
          reference_period: string
          source: string
          source_url: string
          updated_at: string
        }
        Insert: {
          annual_rate: number
          category: string
          created_at?: string
          id?: string
          institution: string
          modality: string
          monthly_rate: number
          position?: number
          reference_period: string
          source: string
          source_url: string
          updated_at?: string
        }
        Update: {
          annual_rate?: number
          category?: string
          created_at?: string
          id?: string
          institution?: string
          modality?: string
          monthly_rate?: number
          position?: number
          reference_period?: string
          source?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_update_log: {
        Row: {
          created_at: string
          details: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          details: string
          id?: string
          source: string
        }
        Update: {
          created_at?: string
          details?: string
          id?: string
          source?: string
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
      check_public_lead_rate_limit: {
        Args: { p_identity: string }
        Returns: undefined
      }
      consume_public_submission_limit: {
        Args: { p_scope: string }
        Returns: undefined
      }
      is_crm_admin: { Args: never; Returns: boolean }
      receive_public_lead: {
        Args: {
          p_city: string
          p_consent?: boolean
          p_estimated_value?: number
          p_name: string
          p_objective: string
          p_phone: string
        }
        Returns: string
      }
      receive_public_simulation_lead: {
        Args: {
          p_consent?: boolean
          p_email: string
          p_estimated_value: number
          p_monthly_estimate: number
          p_name: string
          p_objective: string
          p_phone: string
          p_product_type: string
          p_term_months: number
        }
        Returns: string
      }
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
