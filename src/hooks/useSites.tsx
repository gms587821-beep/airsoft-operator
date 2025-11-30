import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface Site {
  id: string;
  name: string;
  country: string;
  region?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  field_type: string;
  thumbnail_url?: string;
  website_url?: string;
  booking_url?: string;
  phone?: string;
  opening_hours?: string;
  chrono_rules?: string;
  description?: string;
  is_user_created: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteWithRatings extends Site {
  average_overall?: number;
  average_safety?: number;
  average_marshal?: number;
  average_gameplay?: number;
  rating_count?: number;
}

interface UseSitesParams {
  fieldType?: string;
  searchTerm?: string;
  country?: string;
  favouritesOnly?: boolean;
  locationType?: string;
}

export const useSites = (params?: UseSitesParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sites", params, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("sites")
        .select("*")
        .order("name", { ascending: true });

      if (params?.fieldType) {
        query = query.eq("field_type", params.fieldType);
      }

      if (params?.searchTerm) {
        query = query.or(
          `name.ilike.%${params.searchTerm}%,city.ilike.%${params.searchTerm}%,region.ilike.%${params.searchTerm}%`
        );
      }

      if (params?.country) {
        query = query.eq("country", params.country);
      }

      // Filter by location type (Playing Sites vs Shops)
      if (params?.locationType) {
        if (params.locationType === "Shops") {
          query = query.eq("field_type", "Shop");
        } else if (params.locationType === "Playing Sites") {
          query = query.neq("field_type", "Shop");
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      let sites = data as Site[];

      // Filter by favourites if requested
      if (params?.favouritesOnly && user) {
        const { data: favourites, error: favError } = await supabase
          .from("site_favourites")
          .select("site_id")
          .eq("user_id", user.id);

        if (favError) throw favError;

        const favouriteIds = new Set(favourites?.map((f) => f.site_id) || []);
        sites = sites.filter((site) => favouriteIds.has(site.id));
      }

      return sites;
    },
  });
};

export const useSite = (id: string) => {
  return useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Site;
    },
    enabled: !!id,
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (siteData: Partial<Site>) => {
      if (!user) throw new Error("Must be logged in to create a site");

      const { data, error } = await supabase
        .from("sites")
        .insert([{
          ...siteData,
          is_user_created: true,
          created_by: user.id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      toast({
        title: "Site added",
        description: "The airsoft site has been added to the directory.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding site",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
