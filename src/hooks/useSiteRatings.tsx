import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface SiteRating {
  id: string;
  site_id: string;
  user_id: string;
  overall_rating: number;
  safety_rating: number;
  marshal_rating: number;
  gameplay_rating: number;
  comment?: string;
  created_at: string;
}

export const useSiteRatings = (siteId: string) => {
  return useQuery({
    queryKey: ["site-ratings", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_ratings")
        .select("*")
        .eq("site_id", siteId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SiteRating[];
    },
    enabled: !!siteId,
  });
};

export const useUserSiteRating = (siteId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-site-rating", siteId, user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("site_ratings")
        .select("*")
        .eq("site_id", siteId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as SiteRating | null;
    },
    enabled: !!siteId && !!user,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ratingData: Omit<SiteRating, "id" | "created_at">) => {
      if (!user) throw new Error("Must be logged in to rate a site");

      const { data, error } = await supabase
        .from("site_ratings")
        .upsert({
          ...ratingData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site-ratings", variables.site_id] });
      queryClient.invalidateQueries({ queryKey: ["user-site-rating", variables.site_id] });
      toast({
        title: "Rating saved",
        description: "Your rating has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSiteRatingStats = (siteId: string) => {
  const { data: ratings } = useSiteRatings(siteId);

  if (!ratings || ratings.length === 0) {
    return {
      averageOverall: 0,
      averageSafety: 0,
      averageMarshal: 0,
      averageGameplay: 0,
      count: 0,
    };
  }

  const sum = ratings.reduce(
    (acc, rating) => ({
      overall: acc.overall + rating.overall_rating,
      safety: acc.safety + rating.safety_rating,
      marshal: acc.marshal + rating.marshal_rating,
      gameplay: acc.gameplay + rating.gameplay_rating,
    }),
    { overall: 0, safety: 0, marshal: 0, gameplay: 0 }
  );

  const count = ratings.length;

  return {
    averageOverall: Math.round((sum.overall / count) * 10) / 10,
    averageSafety: Math.round((sum.safety / count) * 10) / 10,
    averageMarshal: Math.round((sum.marshal / count) * 10) / 10,
    averageGameplay: Math.round((sum.gameplay / count) * 10) / 10,
    count,
  };
};
