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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      message_replies: {
        Row: {
          content: string
          created_at: string
          external_reply_id: string | null
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          external_reply_id?: string | null
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          external_reply_id?: string | null
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_replies_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          external_message_id: string
          id: string
          is_read: boolean
          message_type: string
          received_at: string
          sender_name: string
          sender_platform_id: string
          social_account_id: string
        }
        Insert: {
          content: string
          created_at?: string
          external_message_id: string
          id?: string
          is_read?: boolean
          message_type: string
          received_at: string
          sender_name: string
          sender_platform_id: string
          social_account_id: string
        }
        Update: {
          content?: string
          created_at?: string
          external_message_id?: string
          id?: string
          is_read?: boolean
          message_type?: string
          received_at?: string
          sender_name?: string
          sender_platform_id?: string
          social_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "user_social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          container_id: string | null
          content: string
          created_at: string
          id: string
          media_type: string | null
          media_urls: Json | null
          platform_id: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          container_id?: string | null
          content: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_urls?: Json | null
          platform_id?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          container_id?: string | null
          content?: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_urls?: Json | null
          platform_id?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_platform"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          caption: string
          created_at: string
          error_message: string | null
          id: string
          is_carousel: boolean | null
          media_urls: Json | null
          post_type: string
          published_at: string | null
          scheduled_at: string
          social_media_id: string | null
          status: string
          updated_at: string
          user_id: string
          user_social_account_id: string
        }
        Insert: {
          caption: string
          created_at?: string
          error_message?: string | null
          id?: string
          is_carousel?: boolean | null
          media_urls?: Json | null
          post_type: string
          published_at?: string | null
          scheduled_at: string
          social_media_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          user_social_account_id: string
        }
        Update: {
          caption?: string
          created_at?: string
          error_message?: string | null
          id?: string
          is_carousel?: boolean | null
          media_urls?: Json | null
          post_type?: string
          published_at?: string | null
          scheduled_at?: string
          social_media_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          user_social_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_user_social_account_id_fkey"
            columns: ["user_social_account_id"]
            isOneToOne: false
            referencedRelation: "user_social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires: string
          id?: string
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires?: string
          id?: string
          session_token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_platforms: {
        Row: {
          base_api_url: string | null
          display_name: string | null
          id: number
          name: string
        }
        Insert: {
          base_api_url?: string | null
          display_name?: string | null
          id?: number
          name: string
        }
        Update: {
          base_api_url?: string | null
          display_name?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_social_accounts: {
        Row: {
          access_token: string
          account_name: string
          account_type: string | null
          created_at: string
          followers_count: number | null
          follows_count: number | null
          handle: string
          id: string
          platform_id: number
          platform_specific_id: string
          platform_user_id: string
          profile_picture_url: string | null
          refresh_token: string | null
          token_expires_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_name: string
          account_type?: string | null
          created_at?: string
          followers_count?: number | null
          follows_count?: number | null
          handle: string
          id?: string
          platform_id: number
          platform_specific_id: string
          platform_user_id: string
          profile_picture_url?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_name?: string
          account_type?: string | null
          created_at?: string
          followers_count?: number | null
          follows_count?: number | null
          handle?: string
          id?: string
          platform_id?: number
          platform_specific_id?: string
          platform_user_id?: string
          profile_picture_url?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_social_accounts_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_social_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          email_verified: string | null
          first_name: string
          id: string
          image: string | null
          last_name: string
          name: string | null
          role_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: string | null
          first_name: string
          id?: string
          image?: string | null
          last_name: string
          name?: string | null
          role_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: string | null
          first_name?: string
          id?: string
          image?: string | null
          last_name?: string
          name?: string | null
          role_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
