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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          created_at: string | null
          earned_at: string | null
          icon: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          created_at?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          created_at?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_conversations: {
        Row: {
          conversation: Json
          created_at: string
          gun_id: string | null
          id: string
          operator_name: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation: Json
          created_at?: string
          gun_id?: string | null
          id?: string
          operator_name?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation?: Json
          created_at?: string
          gun_id?: string | null
          id?: string
          operator_name?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_conversations_gun_id_fkey"
            columns: ["gun_id"]
            isOneToOne: false
            referencedRelation: "guns"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          booking_reference: string | null
          cost: number | null
          created_at: string
          deaths: number | null
          game_date: string
          id: string
          is_upcoming: boolean
          kills: number | null
          notes: string | null
          player_class: string | null
          site_location: string | null
          site_name: string
          updated_at: string
          user_id: string
          weapon_used: string | null
        }
        Insert: {
          booking_reference?: string | null
          cost?: number | null
          created_at?: string
          deaths?: number | null
          game_date: string
          id?: string
          is_upcoming?: boolean
          kills?: number | null
          notes?: string | null
          player_class?: string | null
          site_location?: string | null
          site_name: string
          updated_at?: string
          user_id: string
          weapon_used?: string | null
        }
        Update: {
          booking_reference?: string | null
          cost?: number | null
          created_at?: string
          deaths?: number | null
          game_date?: string
          id?: string
          is_upcoming?: boolean
          kills?: number | null
          notes?: string | null
          player_class?: string | null
          site_location?: string | null
          site_name?: string
          updated_at?: string
          user_id?: string
          weapon_used?: string | null
        }
        Relationships: []
      }
      gun_maintenance: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          gun_id: string
          id: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          next_due_date: string | null
          parts_replaced: string[] | null
          performed_at: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          gun_id: string
          id?: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          next_due_date?: string | null
          parts_replaced?: string[] | null
          performed_at?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          gun_id?: string
          id?: string
          maintenance_type?: Database["public"]["Enums"]["maintenance_type"]
          next_due_date?: string | null
          parts_replaced?: string[] | null
          performed_at?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gun_maintenance_gun_id_fkey"
            columns: ["gun_id"]
            isOneToOne: false
            referencedRelation: "guns"
            referencedColumns: ["id"]
          },
        ]
      }
      guns: {
        Row: {
          brand: string | null
          condition: string | null
          created_at: string | null
          fps: number | null
          gun_type: string
          id: string
          joules: number | null
          model: string | null
          name: string
          notes: string | null
          photo_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          updated_at: string | null
          upgrades: string[] | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          condition?: string | null
          created_at?: string | null
          fps?: number | null
          gun_type: string
          id?: string
          joules?: number | null
          model?: string | null
          name: string
          notes?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          updated_at?: string | null
          upgrades?: string[] | null
          user_id: string
        }
        Update: {
          brand?: string | null
          condition?: string | null
          created_at?: string | null
          fps?: number | null
          gun_type?: string
          id?: string
          joules?: number | null
          model?: string | null
          name?: string
          notes?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          updated_at?: string | null
          upgrades?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_items: {
        Row: {
          brand: string | null
          condition: string | null
          created_at: string
          id: string
          item_type: string
          model: string | null
          name: string
          notes: string | null
          photo_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          item_type: string
          model?: string | null
          name: string
          notes?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          item_type?: string
          model?: string | null
          name?: string
          notes?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loadouts: {
        Row: {
          created_at: string | null
          description: string | null
          gear_items: string[] | null
          id: string
          name: string
          primary_gun_id: string | null
          secondary_gun_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gear_items?: string[] | null
          id?: string
          name: string
          primary_gun_id?: string | null
          secondary_gun_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gear_items?: string[] | null
          id?: string
          name?: string
          primary_gun_id?: string | null
          secondary_gun_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loadouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          accent_color: string
          created_at: string | null
          default_avatar: string | null
          id: string
          name: string
          personality_description: string | null
          primary_module: string
          role: string
        }
        Insert: {
          accent_color: string
          created_at?: string | null
          default_avatar?: string | null
          id?: string
          name: string
          personality_description?: string | null
          primary_module: string
          role: string
        }
        Update: {
          accent_color?: string
          created_at?: string | null
          default_avatar?: string | null
          id?: string
          name?: string
          personality_description?: string | null
          primary_module?: string
          role?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_operator_id: string | null
          created_at: string | null
          display_name: string | null
          games_played: number | null
          id: string
          member_since: string | null
          updated_at: string | null
        }
        Insert: {
          active_operator_id?: string | null
          created_at?: string | null
          display_name?: string | null
          games_played?: number | null
          id: string
          member_since?: string | null
          updated_at?: string | null
        }
        Update: {
          active_operator_id?: string | null
          created_at?: string | null
          display_name?: string | null
          games_played?: number | null
          id?: string
          member_since?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_operator_id_fkey"
            columns: ["active_operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      maintenance_type:
        | "cleaning"
        | "part_replacement"
        | "inspection"
        | "lubrication"
        | "repair"
        | "upgrade"
        | "other"
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
      maintenance_type: [
        "cleaning",
        "part_replacement",
        "inspection",
        "lubrication",
        "repair",
        "upgrade",
        "other",
      ],
    },
  },
} as const
