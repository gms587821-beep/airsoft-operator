import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      
      // Invalidate profile query to refresh subscription data
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      
      return data;
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const startCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast.error('Failed to start checkout. Please try again.');
    }
  };

  const manageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    }
  };

  // Check subscription on mount and periodically
  useEffect(() => {
    if (user) {
      checkSubscription();
      
      const interval = setInterval(checkSubscription, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    checkSubscription,
    startCheckout,
    manageSubscription,
  };
};
