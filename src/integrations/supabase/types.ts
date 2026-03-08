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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      gyms: {
        Row: {
          city: string
          closing_time: string
          created_at: string
          current_offers: string | null
          description: string | null
          email: string
          equipment_list: string | null
          facilities: string[]
          full_address: string
          gym_name: string
          id: string
          membership_monthly: string | null
          membership_quarterly: string | null
          membership_yearly: string | null
          opening_time: string
          owner_name: string
          phone: string
          social_media: string | null
          state: string
          status: string
          trainer_count: string | null
          working_days: string[]
        }
        Insert: {
          city: string
          closing_time: string
          created_at?: string
          current_offers?: string | null
          description?: string | null
          email: string
          equipment_list?: string | null
          facilities?: string[]
          full_address: string
          gym_name: string
          id?: string
          membership_monthly?: string | null
          membership_quarterly?: string | null
          membership_yearly?: string | null
          opening_time: string
          owner_name: string
          phone: string
          social_media?: string | null
          state: string
          status?: string
          trainer_count?: string | null
          working_days?: string[]
        }
        Update: {
          city?: string
          closing_time?: string
          created_at?: string
          current_offers?: string | null
          description?: string | null
          email?: string
          equipment_list?: string | null
          facilities?: string[]
          full_address?: string
          gym_name?: string
          id?: string
          membership_monthly?: string | null
          membership_quarterly?: string | null
          membership_yearly?: string | null
          opening_time?: string
          owner_name?: string
          phone?: string
          social_media?: string | null
          state?: string
          status?: string
          trainer_count?: string | null
          working_days?: string[]
        }
        Relationships: []
      }
      trainers: {
        Row: {
          available_days: string[] | null
          bio: string | null
          cert_file: string | null
          cert_issuer: string | null
          cert_name: string | null
          cert_status: string
          city: string
          client_types: string | null
          cpr_certified: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          gender: string | null
          gov_id_file: string | null
          gov_id_type: string | null
          id: string
          id_status: string
          languages: string | null
          max_clients: string | null
          name: string
          online_training: string | null
          package_rate: string | null
          phone: string
          session_duration: string | null
          session_rate: string | null
          social_media: string | null
          specialties: string[] | null
          state: string
          training_style: string | null
          travel_willing: string | null
          years_experience: string | null
        }
        Insert: {
          available_days?: string[] | null
          bio?: string | null
          cert_file?: string | null
          cert_issuer?: string | null
          cert_name?: string | null
          cert_status?: string
          city: string
          client_types?: string | null
          cpr_certified?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          gender?: string | null
          gov_id_file?: string | null
          gov_id_type?: string | null
          id?: string
          id_status?: string
          languages?: string | null
          max_clients?: string | null
          name: string
          online_training?: string | null
          package_rate?: string | null
          phone: string
          session_duration?: string | null
          session_rate?: string | null
          social_media?: string | null
          specialties?: string[] | null
          state: string
          training_style?: string | null
          travel_willing?: string | null
          years_experience?: string | null
        }
        Update: {
          available_days?: string[] | null
          bio?: string | null
          cert_file?: string | null
          cert_issuer?: string | null
          cert_name?: string | null
          cert_status?: string
          city?: string
          client_types?: string | null
          cpr_certified?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          gender?: string | null
          gov_id_file?: string | null
          gov_id_type?: string | null
          id?: string
          id_status?: string
          languages?: string | null
          max_clients?: string | null
          name?: string
          online_training?: string | null
          package_rate?: string | null
          phone?: string
          session_duration?: string | null
          session_rate?: string | null
          social_media?: string | null
          specialties?: string[] | null
          state?: string
          training_style?: string | null
          travel_willing?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
