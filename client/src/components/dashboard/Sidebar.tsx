'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Vote, 
  Users, 
  Settings, 
  Plus,
  BarChart3,
  User,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'candidate', 'customer'],
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Vote,
    roles: ['admin'],
  },
  {
    name: 'Create Campaign',
    href: '/dashboard/campaigns/create',
    icon: Plus,
    roles: ['admin'],
  },
  {
    name: 'Browse Campaigns',
    href: '/dashboard/browse',
    icon: Calendar,
    roles: ['customer', 'candidate'],
  },
  {
    name: 'My Votes',
    href: '/dashboard/votes',
    icon: BarChart3,
    roles: ['customer', 'candidate'],
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['admin', 'candidate', 'customer'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin', 'candidate', 'customer'],
  },
];

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            🗳️
          </div>
          <span className="text-xl font-bold">VoteSecure</span>
        </Link>
      </div>

      <nav className="mt-8">
        <div className="px-3">
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {userRole === 'admin' && 'Administration'}
              {userRole === 'candidate' && 'Candidate Portal'}
              {userRole === 'customer' && 'Voter Portal'}
            </div>
          </div>

          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 text-center">
          <div className="capitalize font-medium text-slate-300">{userRole} Account</div>
          <div>VoteSecure Dashboard</div>
        </div>
      </div>
    </div>
  );
}