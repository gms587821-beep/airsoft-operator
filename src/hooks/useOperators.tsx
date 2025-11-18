import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Operator {
  id: string;
  name: string;
  role: string;
  personality_description: string | null;
  default_avatar: string | null;
  accent_color: string;
  primary_module: string;
}

export const useOperators = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: operators, isLoading: operatorsLoading } = useQuery({
    queryKey: ["operators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operators")
        .select("*")
        .order("created_at");
      
      if (error) throw error;
      return data as Operator[];
    },
  });

  const { data: activeOperator, isLoading: activeOperatorLoading } = useQuery({
    queryKey: ["active-operator", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("active_operator_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile.active_operator_id) {
        // Default to The Marshal if no operator is set
        const { data: defaultOp } = await supabase
          .from("operators")
          .select("*")
          .eq("name", "The Marshal")
          .single();
        return defaultOp as Operator | null;
      }

      const { data: operator, error: operatorError } = await supabase
        .from("operators")
        .select("*")
        .eq("id", profile.active_operator_id)
        .single();

      if (operatorError) throw operatorError;
      return operator as Operator;
    },
  });

  const setActiveOperator = useMutation({
    mutationFn: async (operatorId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ active_operator_id: operatorId })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-operator"] });
    },
  });

  const getOperatorForContext = (context: string): Operator | null => {
    if (!operators) return null;

    const contextMap: Record<string, string> = {
      diagnostics: "The Armourer",
      tools: "The Armourer",
      maintenance: "The Armourer",
      onboarding: "The Marshal",
      social: "The Marshal",
      booking: "The Marshal",
      sites: "The Marshal",
    };

    const operatorName = contextMap[context.toLowerCase()];
    return operators.find((op) => op.name === operatorName) || null;
  };

  return {
    operators,
    activeOperator,
    operatorsLoading,
    activeOperatorLoading,
    setActiveOperator: setActiveOperator.mutate,
    getOperatorForContext,
  };
};
