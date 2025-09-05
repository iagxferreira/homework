'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignup } from '@/hooks/useAuth';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';

export default function SignupPage() {
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4 hover:bg-blue-700 transition-colors">
            🗳️
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Join VoteSecure</h1>
          <p className="text-slate-600">Create your account to start voting</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800">Create Account</CardTitle>
            <CardDescription className="text-slate-600">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {signupMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {signupMutation.error.message}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-11"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a secure password"
                  className="h-11"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
                {!errors.password && (
                  <p className="text-xs text-slate-500">Password must contain at least one uppercase letter, one lowercase letter, and one number</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700 font-medium">Account Type</Label>
                <select
                  id="role"
                  className="w-full h-11 px-3 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('role')}
                >
                  <option value="customer">Voter</option>
                  <option value="candidate">Candidate</option>
                  <option value="admin">Administrator</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                )}
                <p className="text-xs text-slate-500">
                  Choose your account type. Voters can participate in campaigns, Candidates can be nominated, and Administrators can create campaigns.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 shadow-lg hover:shadow-xl transition-all"
                disabled={signupMutation.isPending || isSubmitting}
              >
                {signupMutation.isPending || isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}