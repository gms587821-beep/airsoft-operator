import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface MarketplaceListing {
  id: string;
  title: string;
  description?: string;
  category: string;
  condition: string;
  price: number;
  currency: string;
  image_url?: string;
  location?: string;
  seller_user_id: string;
  linked_gun_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseMarketplaceListingsParams {
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  myListingsOnly?: boolean;
}

export const useMarketplaceListings = (params?: UseMarketplaceListingsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketplace-listings", params, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("marketplace_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (params?.myListingsOnly && user) {
        query = query.eq("seller_user_id", user.id);
      } else {
        query = query.eq("is_active", true);
      }

      if (params?.category) {
        query = query.eq("category", params.category);
      }

      if (params?.searchTerm) {
        query = query.ilike("title", `%${params.searchTerm}%`);
      }

      if (params?.minPrice !== undefined) {
        query = query.gte("price", params.minPrice);
      }

      if (params?.maxPrice !== undefined) {
        query = query.lte("price", params.maxPrice);
      }

      if (params?.location) {
        query = query.ilike("location", `%${params.location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketplaceListing[];
    },
    enabled: !params?.myListingsOnly || !!user,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["marketplace-listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as MarketplaceListing;
    },
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listingData: Partial<MarketplaceListing>) => {
      if (!user) throw new Error("Must be logged in to create a listing");

      const { data, error } = await supabase
        .from("marketplace_listings")
        .insert([{
          ...listingData,
          seller_user_id: user.id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      toast({
        title: "Listing created",
        description: "Your gear is now listed on the marketplace.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<MarketplaceListing>;
    }) => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      toast({
        title: "Listing updated",
        description: "Your listing has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeactivateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .update({ is_active: false })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      toast({
        title: "Listing deactivated",
        description: "Your listing has been marked as sold/inactive.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deactivating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
