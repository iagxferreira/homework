'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Calendar, Users, BarChart3, Vote, Clock, CheckCircle } from 'lucide-react';

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
  candidates: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    description: string;
    voteCount: number;
  }[];
  totalVotes: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface UserVote {
  hasVoted: boolean;
  vote: {
    candidate: {
      _id: string;
      name: string;
    };
    votedAt: string;
  } | null;
}

export default function BrowseCampaignsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
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
      fetchCampaigns();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/signin');
    }
  }, [router]);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/campaigns?status=active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
        
        // Check voting status for each campaign
        const votesStatus: Record<string, UserVote> = {};
        for (const campaign of data.campaigns) {
          const voteResponse = await fetch(`http://localhost:5000/api/campaigns/${campaign._id}/my-vote`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (voteResponse.ok) {
            const voteData = await voteResponse.json();
            votesStatus[campaign._id] = voteData;
          }
        }
        setUserVotes(votesStatus);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (campaignId: string, candidateId: string) => {
    setVotingLoading(prev => ({ ...prev, [campaignId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateId }),
      });

      if (response.ok) {
        // Refresh campaigns and vote status
        fetchCampaigns();
      } else {
        const errorData = await response.json();
        alert(`Voting failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote. Please try again.');
    } finally {
      setVotingLoading(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isVotingOpen = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    return now >= start && now <= end && campaign.status === 'active';
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
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Active Campaigns</h1>
                <p className="text-slate-600">
                  {user.role === 'customer' && 'Browse and vote in active campaigns'}
                  {user.role === 'candidate' && 'View campaigns and track voting progress'}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : campaigns.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Vote className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No active campaigns</h3>
                    <p className="text-slate-500">There are no campaigns currently open for voting.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {campaigns.map((campaign) => {
                    const userVote = userVotes[campaign._id];
                    const votingOpen = isVotingOpen(campaign);
                    const isLoading = votingLoading[campaign._id];

                    return (
                      <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                                <Badge className={getStatusColor(campaign.status)}>
                                  {campaign.status}
                                </Badge>
                                {userVote?.hasVoted && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Voted
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="text-base">
                                {campaign.description}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
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
                              <span>{campaign.totalVotes} total votes</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900">Candidates</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              {campaign.candidates.map((candidate) => (
                                <div
                                  key={candidate._id}
                                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-slate-900">{candidate.user.name}</h5>
                                    <span className="text-sm text-slate-500">{candidate.voteCount} votes</span>
                                  </div>
                                  
                                  {candidate.description && (
                                    <p className="text-sm text-slate-600 mb-3">{candidate.description}</p>
                                  )}

                                  {user.role === 'customer' && (
                                    <>
                                      {userVote?.hasVoted ? (
                                        <div className="flex items-center text-sm">
                                          {userVote.vote?.candidate._id === candidate.user._id ? (
                                            <span className="text-blue-600 font-medium flex items-center">
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              You voted for this candidate
                                            </span>
                                          ) : (
                                            <span className="text-slate-500">You voted for someone else</span>
                                          )}
                                        </div>
                                      ) : votingOpen ? (
                                        <Button
                                          size="sm"
                                          onClick={() => handleVote(campaign._id, candidate.user._id)}
                                          disabled={isLoading}
                                          className="w-full"
                                        >
                                          {isLoading ? 'Voting...' : 'Vote for this candidate'}
                                        </Button>
                                      ) : (
                                        <Button size="sm" disabled className="w-full">
                                          Voting Closed
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>

                            {userVote?.hasVoted && userVote.vote && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-blue-900">
                                      You voted for {userVote.vote.candidate.name}
                                    </p>
                                    <p className="text-sm text-blue-700">
                                      Voted on {formatDate(userVote.vote.votedAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {!votingOpen && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-5 w-5 text-yellow-600" />
                                  <p className="text-yellow-800">
                                    {new Date() < new Date(campaign.startDate) 
                                      ? 'Voting has not started yet' 
                                      : 'Voting period has ended'
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}