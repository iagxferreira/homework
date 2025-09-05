'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useAuth';
import { LogOut, Bell, User } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useLogout();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="text-slate-500 capitalize">{user.role}</div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}