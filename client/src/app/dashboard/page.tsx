'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useLogout } from '@/hooks/useAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/signin');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/signin');
    }
  }, [router]);

  const { logout } = useLogout();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar userRole={user.role} />
        <div className="flex-1 ml-64">
          <DashboardHeader user={user} />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-slate-600">
                  {user.role === 'admin' && 'Manage campaigns and oversee the voting system.'}
                  {user.role === 'candidate' && 'View campaigns where you are a candidate and track your progress.'}
                  {user.role === 'customer' && 'Participate in active voting campaigns and make your voice heard.'}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Role</CardTitle>
                    <CardDescription>Current account permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {user.role.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 capitalize">{user.role}</div>
                        <div className="text-sm text-slate-500">
                          Member since {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Popular tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {user.role === 'admin' && (
                      <>
                        <Button className="w-full" variant="outline" size="sm">
                          Create Campaign
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          Manage Users
                        </Button>
                      </>
                    )}
                    {user.role === 'customer' && (
                      <>
                        <Button className="w-full" variant="outline" size="sm">
                          Browse Campaigns
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          View My Votes
                        </Button>
                      </>
                    )}
                    {user.role === 'candidate' && (
                      <>
                        <Button className="w-full" variant="outline" size="sm">
                          My Campaigns
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          View Results
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Info</CardTitle>
                    <CardDescription>Your details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-900">Email: </span>
                      <span className="text-sm text-slate-600">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-900">ID: </span>
                      <span className="text-sm text-slate-600 font-mono">{user._id.slice(0, 8)}...</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline" size="sm">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}