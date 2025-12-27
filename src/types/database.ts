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
      players: {
        Row: {
          id: string
          username: string
          rating: number
          rd: number
          volatility: number
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          rating?: number
          rd?: number
          volatility?: number
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          rating?: number
          rd?: number
          volatility?: number
          avatar_url?: string | null
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          winner_id: string
          loser_id: string
          score: string
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          winner_id: string
          loser_id: string
          score: string
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          winner_id?: string
          loser_id?: string
          score?: string
          verified?: boolean
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          challenger_id: string
          challenged_id: string
          status: string
          resolved_match_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          challenger_id: string
          challenged_id: string
          status?: string
          resolved_match_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          challenger_id?: string
          challenged_id?: string
          status?: string
          resolved_match_id?: string | null
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
