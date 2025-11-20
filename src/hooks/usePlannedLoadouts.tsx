import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface PlannedLoadout {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface PlannedLoadoutItem {
  id: string;
  loadout_id: string;
  name: string;
  category: string;
  photo_url?: string;
  price: number;
  retailer_name: string;
  purchase_link?: string;
  notes?: string;
  created_at: string;
}

export const usePlannedLoadouts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: loadouts, isLoading } = useQuery({
    queryKey: ["planned-loadouts", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("planned_loadouts")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as PlannedLoadout[];
    },
    enabled: !!user,
  });

  const createLoadout = useMutation({
    mutationFn: async (loadout: { name: string; description?: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("planned_loadouts")
        .insert({
          user_id: user.id,
          name: loadout.name,
          description: loadout.description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Loadout created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create loadout");
      console.error("Error creating loadout:", error);
    },
  });

  const updateLoadout = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from("planned_loadouts")
        .update({ name, description })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Loadout updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update loadout");
      console.error("Error updating loadout:", error);
    },
  });

  const deleteLoadout = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("planned_loadouts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Loadout deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete loadout");
      console.error("Error deleting loadout:", error);
    },
  });

  return {
    loadouts: loadouts || [],
    isLoading,
    createLoadout: createLoadout.mutate,
    updateLoadout: updateLoadout.mutate,
    deleteLoadout: deleteLoadout.mutate,
  };
};

export const useLoadoutItems = (loadoutId: string) => {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["loadout-items", loadoutId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planned_loadout_items")
        .select("*")
        .eq("loadout_id", loadoutId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as PlannedLoadoutItem[];
    },
    enabled: !!loadoutId,
  });

  const addItem = useMutation({
    mutationFn: async (item: Omit<PlannedLoadoutItem, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("planned_loadout_items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loadout-items", loadoutId] });
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Item added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add item");
      console.error("Error adding item:", error);
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<PlannedLoadoutItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("planned_loadout_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loadout-items", loadoutId] });
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("planned_loadout_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loadout-items", loadoutId] });
      queryClient.invalidateQueries({ queryKey: ["planned-loadouts"] });
      toast.success("Item removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove item");
      console.error("Error removing item:", error);
    },
  });

  return {
    items: items || [],
    isLoading,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    deleteItem: deleteItem.mutate,
  };
};
