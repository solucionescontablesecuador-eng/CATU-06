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
      aperturas: {
        Row: {
          cerrada: boolean | null
          created_at: string | null
          fecha_hora: string | null
          id: string
          monto_inicial: number
          observaciones: string | null
          turno_id: string
        }
        Insert: {
          cerrada?: boolean | null
          created_at?: string | null
          fecha_hora?: string | null
          id?: string
          monto_inicial: number
          observaciones?: string | null
          turno_id: string
        }
        Update: {
          cerrada?: boolean | null
          created_at?: string | null
          fecha_hora?: string | null
          id?: string
          monto_inicial?: number
          observaciones?: string | null
          turno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aperturas_turno_id_fkey"
            columns: ["turno_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      arqueos: {
        Row: {
          apertura_id: string
          comentario: string | null
          created_at: string | null
          diferencia: number
          fecha_hora: string | null
          id: string
          monto_contado: number
          monto_esperado: number
        }
        Insert: {
          apertura_id: string
          comentario?: string | null
          created_at?: string | null
          diferencia: number
          fecha_hora?: string | null
          id?: string
          monto_contado: number
          monto_esperado: number
        }
        Update: {
          apertura_id?: string
          comentario?: string | null
          created_at?: string | null
          diferencia?: number
          fecha_hora?: string | null
          id?: string
          monto_contado?: number
          monto_esperado?: number
        }
        Relationships: [
          {
            foreignKeyName: "arqueos_apertura_id_fkey"
            columns: ["apertura_id"]
            isOneToOne: false
            referencedRelation: "aperturas"
            referencedColumns: ["id"]
          },
        ]
      }
      bitacora_auditoria: {
        Row: {
          accion: string
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          fecha_hora: string | null
          id: string
          registro_id: string
          tabla: string
          usuario_id: string | null
        }
        Insert: {
          accion: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          fecha_hora?: string | null
          id?: string
          registro_id: string
          tabla: string
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          fecha_hora?: string | null
          id?: string
          registro_id?: string
          tabla?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bitacora_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cajas: {
        Row: {
          activa: boolean | null
          created_at: string | null
          id: string
          nombre: string
          tipo: string
          ubicacion: string | null
        }
        Insert: {
          activa?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          tipo: string
          ubicacion?: string | null
        }
        Update: {
          activa?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          tipo?: string
          ubicacion?: string | null
        }
        Relationships: []
      }
      cierres_jornada: {
        Row: {
          cantidad_traslados: number
          created_at: string | null
          diferencias_acumuladas: number
          fecha: string
          fecha_hora_cierre: string | null
          id: string
          reporte_url: string | null
          tiempo_promedio_minutos: number | null
          total_trasladado: number
          traslados_con_diferencia: number
          usuario_cierre_id: string
        }
        Insert: {
          cantidad_traslados: number
          created_at?: string | null
          diferencias_acumuladas: number
          fecha: string
          fecha_hora_cierre?: string | null
          id?: string
          reporte_url?: string | null
          tiempo_promedio_minutos?: number | null
          total_trasladado: number
          traslados_con_diferencia: number
          usuario_cierre_id: string
        }
        Update: {
          cantidad_traslados?: number
          created_at?: string | null
          diferencias_acumuladas?: number
          fecha?: string
          fecha_hora_cierre?: string | null
          id?: string
          reporte_url?: string | null
          tiempo_promedio_minutos?: number | null
          total_trasladado?: number
          traslados_con_diferencia?: number
          usuario_cierre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cierres_jornada_usuario_cierre_id_fkey"
            columns: ["usuario_cierre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_proveedores: {
        Row: {
          created_at: string | null
          id: string
          numero_documento: string
          pagado_por: string
          proveedor: string
          saldo: number
          tipo_documento: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          numero_documento: string
          pagado_por: string
          proveedor: string
          saldo?: number
          tipo_documento: string
          valor?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          numero_documento?: string
          pagado_por?: string
          proveedor?: string
          saldo?: number
          tipo_documento?: string
          valor?: number
        }
        Relationships: []
      }
      parametros: {
        Row: {
          clave: string
          descripcion: string | null
          id: string
          tipo: string
          updated_at: string | null
          valor: string
        }
        Insert: {
          clave: string
          descripcion?: string | null
          id?: string
          tipo: string
          updated_at?: string | null
          valor: string
        }
        Update: {
          clave?: string
          descripcion?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activo: boolean | null
          created_at: string | null
          email: string
          id: string
          nombre_completo: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nombre_completo?: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nombre_completo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recepciones: {
        Row: {
          comentario: string | null
          created_at: string | null
          diferencia: number
          fecha_hora: string | null
          id: string
          monto_recibido: number
          traslado_id: string
          usuario_receptor_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string | null
          diferencia: number
          fecha_hora?: string | null
          id?: string
          monto_recibido: number
          traslado_id: string
          usuario_receptor_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string | null
          diferencia?: number
          fecha_hora?: string | null
          id?: string
          monto_recibido?: number
          traslado_id?: string
          usuario_receptor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recepciones_traslado_id_fkey"
            columns: ["traslado_id"]
            isOneToOne: false
            referencedRelation: "traslados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recepciones_usuario_receptor_id_fkey"
            columns: ["usuario_receptor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      traslados: {
        Row: {
          archivo_adjunto: string | null
          arqueo_id: string
          caja_destino_id: string
          caja_origen_id: string
          created_at: string | null
          estado: string
          fecha_hora_envio: string | null
          id: string
          monto: number
        }
        Insert: {
          archivo_adjunto?: string | null
          arqueo_id: string
          caja_destino_id: string
          caja_origen_id: string
          created_at?: string | null
          estado?: string
          fecha_hora_envio?: string | null
          id?: string
          monto: number
        }
        Update: {
          archivo_adjunto?: string | null
          arqueo_id?: string
          caja_destino_id?: string
          caja_origen_id?: string
          created_at?: string | null
          estado?: string
          fecha_hora_envio?: string | null
          id?: string
          monto?: number
        }
        Relationships: [
          {
            foreignKeyName: "traslados_arqueo_id_fkey"
            columns: ["arqueo_id"]
            isOneToOne: false
            referencedRelation: "arqueos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traslados_caja_destino_id_fkey"
            columns: ["caja_destino_id"]
            isOneToOne: false
            referencedRelation: "cajas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traslados_caja_origen_id_fkey"
            columns: ["caja_origen_id"]
            isOneToOne: false
            referencedRelation: "cajas"
            referencedColumns: ["id"]
          },
        ]
      }
      turnos: {
        Row: {
          caja_id: string
          created_at: string | null
          estado: string
          fecha: string
          hora_fin: string | null
          hora_inicio: string
          id: string
          usuario_id: string
        }
        Insert: {
          caja_id: string
          created_at?: string | null
          estado?: string
          fecha: string
          hora_fin?: string | null
          hora_inicio: string
          id?: string
          usuario_id: string
        }
        Update: {
          caja_id?: string
          created_at?: string | null
          estado?: string
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turnos_caja_id_fkey"
            columns: ["caja_id"]
            isOneToOne: false
            referencedRelation: "cajas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turnos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
