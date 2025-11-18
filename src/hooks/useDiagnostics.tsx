import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface DiagnosticConversation {
  id: string;
  user_id: string;
  gun_id: string | null;
  title: string;
  conversation: any[];
  operator_name: string;
  created_at: string;
  updated_at: string;
}

export const useDiagnostics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: diagnostics, isLoading } = useQuery({
    queryKey: ["diagnostics", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_conversations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as DiagnosticConversation[];
    },
  });

  const saveDiagnostic = useMutation({
    mutationFn: async ({
      title,
      conversation,
      gunId,
      operatorName,
    }: {
      title: string;
      conversation: any[];
      gunId?: string;
      operatorName: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("diagnostic_conversations")
        .insert({
          user_id: user.id,
          gun_id: gunId || null,
          title,
          conversation,
          operator_name: operatorName,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
    },
  });

  const deleteDiagnostic = useMutation({
    mutationFn: async (diagnosticId: string) => {
      const { error } = await supabase
        .from("diagnostic_conversations")
        .delete()
        .eq("id", diagnosticId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
    },
  });

  const getGunDiagnostics = async (gunId: string) => {
    const { data, error } = await supabase
      .from("diagnostic_conversations")
      .select("*")
      .eq("gun_id", gunId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data as DiagnosticConversation[];
  };

  return {
    diagnostics,
    isLoading,
    saveDiagnostic: saveDiagnostic.mutate,
    deleteDiagnostic: deleteDiagnostic.mutate,
    getGunDiagnostics,
  };
};
