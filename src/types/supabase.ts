export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string;
          company_size: string;
          message: string;
          created_at: string;
          status: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company: string;
          company_size: string;
          message: string;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string;
          company_size?: string;
          message?: string;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          grade: string | null;
          quantity: number;
          message: string | null;
          product_id: string | null;
          created_at: string;
          status: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          grade?: string | null;
          quantity: number;
          message?: string | null;
          product_id?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string | null;
          grade?: string | null;
          quantity?: number;
          message?: string | null;
          product_id?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      sample_requests: {
        Row: {
          id: string;
          company_name: string;
          category: string;
          other_category: string | null;
          gst: string;
          phone: string;
          email: string | null;
          address: string;
          selected_products: string[];
          payment_status: string;
          created_at: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          company_name: string;
          category: string;
          other_category?: string | null;
          gst: string;
          phone: string;
          email?: string | null;
          address: string;
          selected_products: string[];
          payment_status?: string;
          created_at?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          company_name?: string;
          category?: string;
          other_category?: string | null;
          gst?: string;
          phone?: string;
          email?: string | null;
          address?: string;
          selected_products?: string[];
          payment_status?: string;
          created_at?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      feedback_submissions: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          feedback_type: string;
          rating: string;
          feedback: string;
          created_at: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          feedback_type: string;
          rating: string;
          feedback: string;
          created_at?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          feedback_type?: string;
          rating?: string;
          feedback?: string;
          created_at?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      product_requests: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          category: string;
          product_name: string;
          quantity: string | null;
          details: string | null;
          created_at: string;
          status: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          category: string;
          product_name: string;
          quantity?: string | null;
          details?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          category?: string;
          product_name?: string;
          quantity?: string | null;
          details?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      Consumer_Product_Request: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          category: string | null;
          product_name: string;
          details: string | null;
          created_at: string;
          status: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          category?: string | null;
          product_name: string;
          details?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          category?: string | null;
          product_name?: string;
          details?: string | null;
          created_at?: string;
          status?: string;
          resolved?: boolean;
        };
        Relationships: [];
      };
      call_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          company_name: string;
          agenda: string;
          created_at: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          company_name: string;
          agenda: string;
          created_at?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          company_name?: string;
          agenda?: string;
          created_at?: string;
          resolved?: boolean;
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
};
