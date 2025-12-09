import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface FollowListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  userIds: string[];
}

interface ProfileData {
  id: string;
  display_name: string | null;
}

const FollowListDialog = ({ open, onOpenChange, title, userIds }: FollowListDialogProps) => {
  const navigate = useNavigate();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles-list', userIds],
    queryFn: async () => {
      if (userIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (error) throw error;
      return data as ProfileData[];
    },
    enabled: open && userIds.length > 0,
  });

  const handleUserClick = (userId: string) => {
    onOpenChange(false);
    navigate(`/user/${userId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : profiles && profiles.length > 0 ? (
            profiles.map((profile) => {
              const displayName = profile.display_name || "Operator";
              const initials = displayName.substring(0, 2).toUpperCase();
              
              return (
                <Button
                  key={profile.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => handleUserClick(profile.id)}
                >
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayName}</span>
                </Button>
              );
            })
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {title === "Following" ? "Not following anyone yet" : "No followers yet"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowListDialog;
