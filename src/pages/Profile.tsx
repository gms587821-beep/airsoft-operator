import { User, Settings, LogOut, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const stats = [
    { label: "Games Played", value: "24" },
    { label: "Loadouts", value: "3" },
    { label: "Gear Items", value: "8" },
  ];

  const menuItems = [
    { icon: User, label: "Edit Profile" },
    { icon: Shield, label: "Operator Settings" },
    { icon: Settings, label: "App Settings" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-tactical border-primary/20 shadow-glow">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                OP
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operator_001</h1>
              <p className="text-muted-foreground">Member since Jan 2025</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="p-4 bg-card border-border hover:border-primary/30 transition-smooth cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary group-hover:bg-primary/20 flex items-center justify-center transition-smooth">
                  <item.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-smooth" />
                </div>
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
