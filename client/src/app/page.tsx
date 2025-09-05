import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Homework
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern full-stack application built with Next.js, Express.js, and MongoDB.
            Get started by creating an account or signing in.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Modern Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with Next.js 15, Express.js, MongoDB, TypeScript, and Tailwind CSS
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔒 Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                JWT-based authentication with bcrypt password hashing
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📚 API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete Swagger documentation available at /api-docs
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Ready to explore? Check out our API documentation:
          </p>
          <Button asChild variant="outline">
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noopener noreferrer">
              View API Docs
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
