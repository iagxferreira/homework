'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const createCampaignSchema = z.object({
  title: z
    .string()
    .min(1, 'Campaign title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Campaign description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be less than 1000 characters'),
  startDate: z
    .string()
    .min(1, 'Start date is required'),
  endDate: z
    .string()
    .min(1, 'End date is required'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  const start = new Date(data.startDate);
  const now = new Date();
  return start > now;
}, {
  message: 'Start date must be in the future',
  path: ['startDate'],
});

type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

export default function CreateCampaignPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
  });

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
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/signin');
    }
  }, [router]);

  const onSubmit = async (data: CreateCampaignFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/dashboard/campaigns');
      } else {
        const errorData = await response.json();
        console.error('Campaign creation failed:', errorData);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60); // At least 1 hour from now
    return now.toISOString().slice(0, 16);
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
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Link 
                  href="/dashboard/campaigns" 
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaigns
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Create New Campaign</h1>
                <p className="text-slate-600">Set up a new voting campaign with candidates and voting periods</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Campaign Details</span>
                      </CardTitle>
                      <CardDescription>
                        Provide the basic information for your voting campaign
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-slate-700 font-medium">
                            Campaign Title *
                          </Label>
                          <Input
                            id="title"
                            placeholder="Enter campaign title"
                            className="h-11"
                            {...register('title')}
                          />
                          {errors.title && (
                            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-slate-700 font-medium">
                            Description *
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe the campaign and what voters are choosing between..."
                            className="min-h-[120px]"
                            {...register('description')}
                          />
                          {errors.description && (
                            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-slate-700 font-medium">
                              Start Date & Time *
                            </Label>
                            <Input
                              id="startDate"
                              type="datetime-local"
                              min={getMinDateTime()}
                              className="h-11"
                              {...register('startDate')}
                            />
                            {errors.startDate && (
                              <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-slate-700 font-medium">
                              End Date & Time *
                            </Label>
                            <Input
                              id="endDate"
                              type="datetime-local"
                              min={getMinDateTime()}
                              className="h-11"
                              {...register('endDate')}
                            />
                            {errors.endDate && (
                              <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                          <Link href="/dashboard/campaigns">
                            <Button variant="outline">Cancel</Button>
                          </Link>
                          <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8"
                          >
                            {isSubmitting ? 'Creating...' : 'Create Campaign'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Next Steps</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Create Campaign</p>
                            <p className="text-sm text-slate-600">Set up basic campaign details</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Add Candidates</p>
                            <p className="text-sm text-slate-600">Invite candidates to participate</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Activate Campaign</p>
                            <p className="text-sm text-slate-600">Make it available for voting</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}