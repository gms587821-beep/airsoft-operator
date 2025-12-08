import { Home, ShoppingBag, MapPin, Wrench, User, MessageSquare } from "lucide-react";
import { NavLink } from "./NavLink";

const Navigation = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageSquare, label: "Feed", path: "/feed" },
    { icon: MapPin, label: "Sites", path: "/sites" },
    { icon: ShoppingBag, label: "Market", path: "/marketplace" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-smooth text-muted-foreground hover:text-foreground"
            activeClassName="text-primary"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
