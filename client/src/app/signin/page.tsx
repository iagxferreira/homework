'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignin } from '@/hooks/useAuth';
import { signinSchema, type SigninFormData } from '@/lib/validations/auth';

export default function SigninPage() {
  const signinMutation = useSignin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SigninFormData) => {
    signinMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4 hover:bg-blue-700 transition-colors">
            🗳️
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to access VoteSecure</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800">Sign In</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {signinMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {signinMutation.error.message}
                </div>
              )}

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
                  placeholder="Enter your password"
                  className="h-11"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 shadow-lg hover:shadow-xl transition-all"
                disabled={signinMutation.isPending || isSubmitting}
              >
                {signinMutation.isPending || isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Create Account
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