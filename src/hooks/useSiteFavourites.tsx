import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface SiteFavourite {
  id: string;
  site_id: string;
  user_id: string;
  created_at: string;
}

export const useSiteFavourites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["site-favourites", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("site_favourites")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as SiteFavourite[];
    },
    enabled: !!user,
  });
};

export const useIsSiteFavourite = (siteId: string) => {
  const { data: favourites } = useSiteFavourites();
  return favourites?.some((fav) => fav.site_id === siteId) || false;
};

export const useToggleSiteFavourite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ siteId, isFavourite }: { siteId: string; isFavourite: boolean }) => {
      if (!user) throw new Error("Must be logged in to favourite a site");

      if (isFavourite) {
        // Remove favourite
        const { error } = await supabase
          .from("site_favourites")
          .delete()
          .eq("site_id", siteId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Add favourite
        const { error } = await supabase
          .from("site_favourites")
          .insert({ site_id: siteId, user_id: user.id });

        if (error) throw error;
      }

      return !isFavourite;
    },
    onSuccess: (newState) => {
      queryClient.invalidateQueries({ queryKey: ["site-favourites"] });
      toast({
        title: newState ? "Site favourited" : "Removed from favourites",
        description: newState
          ? "Added to your favourite sites."
          : "Removed from your favourites.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
