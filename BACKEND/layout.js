import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  LayoutDashboard, 
  Ticket, 
  Plus, 
  Settings, 
  Bell,
  Search,
  Menu,
  LogOut,
  User as UserIcon,
  Shield,
  ShieldCheck, // Added
  Users // Added
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
      roles: ["end_user", "support_agent", "admin"]
    },
    {
      title: "My Tickets",
      url: createPageUrl("Tickets"),
      icon: Ticket,
      roles: ["end_user", "support_agent", "admin"]
    },
    {
      title: "Create Ticket",
      url: createPageUrl("CreateTicket"),
      icon: Plus,
      roles: ["end_user", "support_agent", "admin"]
    },
    {
      title: "All Tickets",
      url: createPageUrl("AllTickets"),
      icon: Ticket,
      roles: ["support_agent", "admin"]
    },
    {
      title: "Admin Panel",
      url: createPageUrl("Admin"),
      icon: Shield,
      roles: ["admin"]
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,#000000,rgba(0,0,0,0.6))]"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="grid md:grid-cols-2 items-center gap-16 max-w-6xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Ticket className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                QuickDesk
              </h1>
              <p className="text-slate-300 text-lg">
                The effortless, intelligent help desk solution designed to streamline your support and delight your users.
              </p>
              <Button 
                onClick={() => User.login()}
                className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all duration-300"
              >
                Sign In & Get Started
              </Button>
            </div>
            <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
              <Ticket className="relative w-40 h-40 text-emerald-400 opacity-20 transform rotate-12" />
              <ShieldCheck className="absolute w-48 h-48 text-sky-400 opacity-20 transform -rotate-12" />
              <Users className="absolute w-32 h-32 text-white opacity-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar className="border-r border-slate-200/60 backdrop-blur-sm bg-white/80">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">QuickDesk</h2>
                <p className="text-xs text-slate-500">Help Desk Solution</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border border-emerald-200' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2">
                Role & Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border-emerald-200">
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Access level: {user.role === 'admin' ? 'Full Access' : user.role === 'support_agent' ? 'Agent Access' : 'User Access'}
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold">
                  {user.full_name?.[0] || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {user.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={createPageUrl("Profile")} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">QuickDesk</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
