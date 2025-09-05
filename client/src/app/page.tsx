import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
            🗳️
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            VoteSecure
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A secure, transparent, and modern digital voting platform. 
            Create polls, cast votes, and view results in real-time with complete transparency and security.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
              <Link href="/signup">Start Voting</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                🔐
              </div>
              <CardTitle className="text-slate-800 text-xl">Secure & Anonymous</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-slate-600 leading-relaxed">
                End-to-end encryption ensures your vote remains private while maintaining complete transparency in the counting process.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                📊
              </div>
              <CardTitle className="text-slate-800 text-xl">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-slate-600 leading-relaxed">
                Watch results update live as votes are cast. Detailed analytics and visualizations help you understand voting patterns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                ⚡
              </div>
              <CardTitle className="text-slate-800 text-xl">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-slate-600 leading-relaxed">
                Intuitive interface makes creating polls and casting votes simple. No technical knowledge required to participate.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-semibold text-slate-800 mb-2">Create Account</h3>
              <p className="text-slate-600 text-sm">Sign up securely to start participating in votes</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-semibold text-slate-800 mb-2">Join or Create Polls</h3>
              <p className="text-slate-600 text-sm">Browse active polls or create your own voting campaigns</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-semibold text-slate-800 mb-2">Vote & View Results</h3>
              <p className="text-slate-600 text-sm">Cast your vote and watch real-time results unfold</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Want to explore the technical documentation?
          </p>
          <Button asChild variant="outline">
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noopener noreferrer">
              View API Documentation
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
