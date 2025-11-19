import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useKitItems = () => {
  const { user } = useAuth();

  const { data: kitItems = [], isLoading, error } = useQuery({
    queryKey: ["kit-items", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("kit_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  return {
    kitItems,
    isLoading,
    error,
  };
};
