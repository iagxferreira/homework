'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Plus, Calendar, Users, BarChart3, Edit, Trash2, Vote } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Campaign {
  _id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  candidates: any[];
  totalVotes: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminCampaignsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
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
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      fetchCampaigns();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/signin');
    }
  }, [router]);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
                  <p className="text-slate-600">Create, manage, and monitor voting campaigns</p>
                </div>
                <Link href="/dashboard/campaigns/create">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Campaign</span>
                  </Button>
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {campaigns.filter(c => c.status === 'draft').length}
                        </p>
                        <p className="text-sm text-slate-600">Draft Campaigns</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {campaigns.filter(c => c.status === 'active').length}
                        </p>
                        <p className="text-sm text-slate-600">Active Campaigns</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {campaigns.filter(c => c.status === 'completed').length}
                        </p>
                        <p className="text-sm text-slate-600">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Vote className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {campaigns.reduce((sum, c) => sum + c.totalVotes, 0)}
                        </p>
                        <p className="text-sm text-slate-600">Total Votes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Campaigns</CardTitle>
                  <CardDescription>
                    Manage your voting campaigns and track their progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No campaigns yet</h3>
                      <p className="text-slate-500 mb-4">Create your first campaign to get started</p>
                      <Link href="/dashboard/campaigns/create">
                        <Button>Create Campaign</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {campaigns.map((campaign) => (
                        <div
                          key={campaign._id}
                          className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {campaign.title}
                                </h3>
                                <Badge className={getStatusColor(campaign.status)}>
                                  {campaign.status}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-4">{campaign.description}</p>
                              <div className="flex items-center space-x-6 text-sm text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{campaign.candidates.length} candidates</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BarChart3 className="h-4 w-4" />
                                  <span>{campaign.totalVotes} votes</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link href={`/dashboard/campaigns/${campaign._id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}