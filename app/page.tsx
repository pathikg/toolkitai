import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            AI-Powered Tools for
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Creative Professionals
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform images, videos, audio, and text with cutting-edge AI technology. 
            All your creative tools in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Browse Tools
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Process your files in seconds with our optimized AI infrastructure
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your files are encrypted and automatically deleted after processing
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">State-of-the-Art AI</h3>
            <p className="text-gray-600">
              Powered by the latest AI models for best-in-class results
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of creators using AI Toolkit today
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 gap-2">
              Start Creating Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
