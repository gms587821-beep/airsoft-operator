import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  photo_url?: string;
  description?: string;
  created_at: string;
}

export interface ProductSupplier {
  id: string;
  product_id: string;
  supplier_name: string;
  price: number;
  purchase_link?: string;
  created_at: string;
}

export const useProductCatalog = () => {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["product-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_catalog")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as CatalogProduct[];
    },
  });

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ["product-suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_suppliers")
        .select("*")
        .order("supplier_name", { ascending: true });

      if (error) throw error;
      return data as ProductSupplier[];
    },
  });

  const getProductsByCategory = (category: string) => {
    return products?.filter((p) => p.category === category) || [];
  };

  const getSuppliersByProduct = (productId: string) => {
    return suppliers?.filter((s) => s.product_id === productId) || [];
  };

  const categories = [
    ...new Set(products?.map((p) => p.category) || []),
  ].sort();

  return {
    products: products || [],
    suppliers: suppliers || [],
    isLoading: productsLoading || suppliersLoading,
    getProductsByCategory,
    getSuppliersByProduct,
    categories,
  };
};
