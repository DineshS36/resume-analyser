'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Zap, Download, ArrowRight, CheckCircle, Star, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-slow" />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <div className="absolute -inset-1 bg-primary-200 rounded-full blur opacity-50" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-6">
            <motion.a 
              href="#features" 
              whileHover={{ scale: 1.05 }}
              className="text-slate-600 hover:text-primary-600 transition-colors font-medium"
            >
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              whileHover={{ scale: 1.05 }}
              className="text-slate-600 hover:text-primary-600 transition-colors font-medium"
            >
              How It Works
            </motion.a>
            {!isLoading && (
              isAuthenticated ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {user?.fullName || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 shadow-sm transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Resume Builder
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"
            >
              Build Your Perfect Resume
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-pink-500">
                with AI Power
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your career story into a professional, ATS-friendly resume. 
              Our AI enhances your bullet points, creates compelling summaries, and 
              helps you land your dream job faster.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                href="/build"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all transform hover:-translate-y-1"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Build Your Resume
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl text-slate-700 bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                Learn More
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>ATS-Friendly</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Create a Professional Resume
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our AI-powered tools help you create resumes that stand out and get results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: 'AI Enhancement', description: 'Let AI optimize your bullet points and summary for maximum impact', color: 'bg-purple-100 text-purple-600' },
              { icon: FileText, title: 'Multiple Templates', description: 'Choose from professionally designed templates that pass ATS', color: 'bg-blue-100 text-blue-600' },
              { icon: Zap, title: 'Instant Analysis', description: 'Get real-time feedback on your resume score and improvements', color: 'bg-amber-100 text-amber-600' },
              { icon: Download, title: 'PDF Export', description: 'Download your resume in PDF format, ready to apply', color: 'bg-green-100 text-green-600' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-slate-50 rounded-2xl p-6 hover:shadow-xl transition-all border border-slate-100"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Create your professional resume in just 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Enter Your Info', description: 'Fill in your personal details, work experience, education, and skills' },
              { number: '2', title: 'AI Enhancement', description: 'Our AI analyzes and optimizes your content for maximum impact' },
              { number: '3', title: 'Choose Template', description: 'Select from our professionally designed resume templates' },
              { number: '4', title: 'Export PDF', description: 'Download your ATS-friendly resume and start applying' },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-purple-300 -translate-y-1/2 -translate-x-1/2 z-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTQtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Join thousands of job seekers who have landed their dream jobs with AI-enhanced resumes
            </p>
            <Link
              href="/build"
              className="inline-flex items-center px-10 py-5 text-xl font-semibold rounded-2xl text-primary-600 bg-white hover:bg-primary-50 transition-all transform hover:scale-105 shadow-xl"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Start Building Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="h-5 w-5" /> AI Resume Builder
          </div>
          <div className="text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
