import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  role?: string;
  brand?: string;
  price: number;
  currency: string;
  image_url?: string;
  is_affiliate: boolean;
  affiliate_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface UseMarketplaceProductsParams {
  category?: string;
  role?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const useMarketplaceProducts = (params?: UseMarketplaceProductsParams) => {
  return useQuery({
    queryKey: ["marketplace-products", params],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (params?.category) {
        query = query.eq("category", params.category);
      }

      if (params?.role) {
        query = query.eq("role", params.role);
      }

      if (params?.searchTerm) {
        query = query.ilike("name", `%${params.searchTerm}%`);
      }

      if (params?.minPrice !== undefined) {
        query = query.gte("price", params.minPrice);
      }

      if (params?.maxPrice !== undefined) {
        query = query.lte("price", params.maxPrice);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
};
