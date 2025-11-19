import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Gun {
  id: string;
  user_id: string;
  name: string;
  gun_type: string;
  brand?: string;
  model?: string;
  fps?: number;
  joules?: number;
  upgrades?: string[];
  notes?: string;
  condition?: string;
  photo_url?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  created_at?: string;
  updated_at?: string;
}

export const useGuns = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: guns, isLoading } = useQuery({
    queryKey: ["guns", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guns")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Gun[];
    },
  });

  const uploadPhoto = async (file: File): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("User not authenticated");

    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('gun-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('gun-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const addGun = useMutation({
    mutationFn: async (gunData: Partial<Gun> & { photo?: File }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      let photoUrl = gunData.photo_url;
      if (gunData.photo) {
        photoUrl = await uploadPhoto(gunData.photo);
      }

      const { photo, ...dataToInsert } = gunData;
      const insertData: any = {
        ...dataToInsert,
        user_id: session.user.id,
      };
      
      if (photoUrl) {
        insertData.photo_url = photoUrl;
      }

      const { data, error } = await supabase
        .from("guns")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guns"] });
      toast.success("Gun added to arsenal");
    },
    onError: (error) => {
      toast.error("Failed to add gun: " + error.message);
    },
  });

  const updateGun = useMutation({
    mutationFn: async ({ id, ...gunData }: Partial<Gun> & { id: string; photo?: File }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      let photoUrl = gunData.photo_url;
      if (gunData.photo) {
        photoUrl = await uploadPhoto(gunData.photo);
      }

      const { photo, ...dataToUpdate } = gunData;
      const { data, error } = await supabase
        .from("guns")
        .update({
          ...dataToUpdate,
          photo_url: photoUrl,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guns"] });
      toast.success("Gun updated");
    },
    onError: (error) => {
      toast.error("Failed to update gun: " + error.message);
    },
  });

  const deleteGun = useMutation({
    mutationFn: async (gunId: string) => {
      const { error } = await supabase
        .from("guns")
        .delete()
        .eq("id", gunId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guns"] });
      toast.success("Gun removed from arsenal");
    },
    onError: (error) => {
      toast.error("Failed to delete gun: " + error.message);
    },
  });

  return {
    guns,
    isLoading,
    addGun: addGun.mutate,
    updateGun: updateGun.mutate,
    deleteGun: deleteGun.mutate,
  };
};
