import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useGameSessions = () => {
  const { user } = useAuth();

  const { data: gameSessions = [], isLoading, error } = useQuery({
    queryKey: ["game-sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("game_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const upcomingSessions = gameSessions.filter((session) => session.is_upcoming);
  const pastSessions = gameSessions.filter((session) => !session.is_upcoming);

  return {
    gameSessions,
    upcomingSessions,
    pastSessions,
    isLoading,
    error,
  };
};
