export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      aluno: {
        Row: {
          codigo: string
          curso: string | null
          id: string
          idade: number | null
          nome: string
          turma: string | null
        }
        Insert: {
          codigo: string
          curso?: string | null
          id?: string
          idade?: number | null
          nome: string
          turma?: string | null
        }
        Update: {
          codigo?: string
          curso?: string | null
          id?: string
          idade?: number | null
          nome?: string
          turma?: string | null
        }
        Relationships: []
      }
      aluno_sessions: {
        Row: {
          aluno_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          session_token: string
        }
        Insert: {
          aluno_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          session_token: string
        }
        Update: {
          aluno_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "aluno_sessions_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos: {
        Row: {
          codigo: string
          curso: string | null
          id: string
          idade: number | null
          nome: string
          senha: string | null
          turma: string | null
        }
        Insert: {
          codigo: string
          curso?: string | null
          id?: string
          idade?: number | null
          nome: string
          senha?: string | null
          turma?: string | null
        }
        Update: {
          codigo?: string
          curso?: string | null
          id?: string
          idade?: number | null
          nome?: string
          senha?: string | null
          turma?: string | null
        }
        Relationships: []
      }
      disciplina: {
        Row: {
          codigo: string
          id: string
          nome: string
          professor: string | null
        }
        Insert: {
          codigo: string
          id?: string
          nome: string
          professor?: string | null
        }
        Update: {
          codigo?: string
          id?: string
          nome?: string
          professor?: string | null
        }
        Relationships: []
      }
      disciplinas: {
        Row: {
          codigo: string
          id: string
          nome: string
          professor: string | null
        }
        Insert: {
          codigo: string
          id?: string
          nome: string
          professor?: string | null
        }
        Update: {
          codigo?: string
          id?: string
          nome?: string
          professor?: string | null
        }
        Relationships: []
      }
      horario: {
        Row: {
          dia: string | null
          disciplina_id: string | null
          fim: string | null
          id: string
          inicio: string | null
          turma: string | null
        }
        Insert: {
          dia?: string | null
          disciplina_id?: string | null
          fim?: string | null
          id?: string
          inicio?: string | null
          turma?: string | null
        }
        Update: {
          dia?: string | null
          disciplina_id?: string | null
          fim?: string | null
          id?: string
          inicio?: string | null
          turma?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horario_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios: {
        Row: {
          dia: string | null
          disciplina_id: string | null
          fim: string | null
          id: string
          inicio: string | null
          turma: string | null
        }
        Insert: {
          dia?: string | null
          disciplina_id?: string | null
          fim?: string | null
          id?: string
          inicio?: string | null
          turma?: string | null
        }
        Update: {
          dia?: string | null
          disciplina_id?: string | null
          fim?: string | null
          id?: string
          inicio?: string | null
          turma?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_horarios_disciplina"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
        ]
      }
      nota: {
        Row: {
          aluno_id: string | null
          disciplina_id: string | null
          id: string
          media_final: number | null
          prova1: number | null
          prova2: number | null
          trabalho: number | null
        }
        Insert: {
          aluno_id?: string | null
          disciplina_id?: string | null
          id?: string
          media_final?: number | null
          prova1?: number | null
          prova2?: number | null
          trabalho?: number | null
        }
        Update: {
          aluno_id?: string | null
          disciplina_id?: string | null
          id?: string
          media_final?: number | null
          prova1?: number | null
          prova2?: number | null
          trabalho?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nota_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nota_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
        ]
      }
      notas: {
        Row: {
          aluno_id: string | null
          disciplina_id: string | null
          id: string
          media_final: number | null
          prova1: number | null
          prova2: number | null
          trabalho: number | null
        }
        Insert: {
          aluno_id?: string | null
          disciplina_id?: string | null
          id?: string
          media_final?: number | null
          prova1?: number | null
          prova2?: number | null
          trabalho?: number | null
        }
        Update: {
          aluno_id?: string | null
          disciplina_id?: string | null
          id?: string
          media_final?: number | null
          prova1?: number | null
          prova2?: number | null
          trabalho?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_notas_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notas_disciplina"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aluno_login: {
        Args: { p_codigo: string; p_senha: string }
        Returns: {
          success: boolean
          session_token: string
          aluno: Json
          message: string
        }[]
      }
      get_aluno_horarios: {
        Args: { p_session_token: string }
        Returns: {
          id: string
          dia: string
          inicio: string
          fim: string
          turma: string
          disciplina_nome: string
          disciplina_codigo: string
        }[]
      }
      get_aluno_notas: {
        Args: { p_session_token: string }
        Returns: {
          id: string
          prova1: number
          prova2: number
          trabalho: number
          media_final: number
          disciplina_nome: string
          disciplina_codigo: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
