'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>      
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight">
                AI-Powered <span className="text-indigo-400">Horse Racing</span> Predictions
              </h1>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl">
                Harness the power of advanced machine learning algorithms to gain a competitive edge in horse racing predictions. Our AI analyzes thousands of data points to deliver accurate forecasts.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href="/register">
                  <Button className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full sm:w-auto">
                    Register Now
                  </Button>
                </Link>
                <Link href="/predict">
                  <Button variant="outline" className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 border-2 w-full sm:w-auto">
                    Try Predictions
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Mobile prediction card - simplified version */}
            <div className="block lg:hidden mt-8 relative">
              <div className="w-full bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-bold text-white">Prediction Model</div>
                  <div className="text-xs text-indigo-400">Ensemble ML</div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Race #1428</span>
                    <span className="text-sm text-green-400">92% Confidence</span>
                  </div>
                  <div className="text-base font-medium text-white">Predicted Winner: Northern Star</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-indigo-900/50 p-2 rounded text-center">
                    <div className="text-xs text-gray-400">Win</div>
                    <div className="text-xs font-medium text-white">64%</div>
                  </div>
                  <div className="bg-indigo-900/50 p-2 rounded text-center">
                    <div className="text-xs text-gray-400">Place</div>
                    <div className="text-xs font-medium text-white">82%</div>
                  </div>
                  <div className="bg-indigo-900/50 p-2 rounded text-center">
                    <div className="text-xs text-gray-400">Show</div>
                    <div className="text-xs font-medium text-white">91%</div>
                  </div>
                  <div className="bg-indigo-900/50 p-2 rounded text-center">
                    <div className="text-xs text-gray-400">ROI</div>
                    <div className="text-xs font-medium text-green-400">+8.2%</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop prediction card - original detailed version */}
            <div className="hidden lg:block relative">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <div className="w-full h-full bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-xl font-bold text-white">Prediction Model</div>
                    <div className="text-sm text-indigo-400">Ensemble ML</div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Race #1428</span>
                        <span className="text-green-400">92% Confidence</span>
                      </div>
                      <div className="text-lg font-medium text-white">Predicted Winner: Northern Star</div>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Win</div>
                          <div className="text-sm font-medium text-white">64%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Place</div>
                          <div className="text-sm font-medium text-white">82%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Show</div>
                          <div className="text-sm font-medium text-white">91%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">ROI</div>
                          <div className="text-sm font-medium text-green-400">+8.2%</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Race #1429</span>
                        <span className="text-green-400">88% Confidence</span>
                      </div>
                      <div className="text-lg font-medium text-white">Predicted Winner: Swift Thunder</div>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Win</div>
                          <div className="text-sm font-medium text-white">58%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Place</div>
                          <div className="text-sm font-medium text-white">76%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">Show</div>
                          <div className="text-sm font-medium text-white">89%</div>
                        </div>
                        <div className="bg-indigo-900/50 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">ROI</div>
                          <div className="text-sm font-medium text-green-400">+7.5%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Advanced Machine Learning Technology</h2>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI to analyze race data and deliver accurate predictions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Ensemble Learning</h3>
              <p className="text-sm md:text-base text-gray-400">
                Our models combine multiple algorithms including Random Forests, Gradient Boosting, and Neural Networks to achieve superior prediction accuracy.
              </p>
            </div>
            <div className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Real-time Processing</h3>
              <p className="text-sm md:text-base text-gray-400">
                Process thousands of data points in real-time, including horse performance history, jockey statistics, track conditions, and weather data.
              </p>
            </div>
            <div className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Adaptive Learning</h3>
              <p className="text-sm md:text-base text-gray-400">
                Our models continuously learn and improve from new race results, adapting to changing conditions and trends in the racing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-3">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-400 mb-1 md:mb-2">93%</div>
              <div className="text-xs md:text-sm text-gray-400">Accuracy for Top 3 Finishes</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-1 md:mb-2">8.7%</div>
              <div className="text-xs md:text-sm text-gray-400">Average ROI</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-400 mb-1 md:mb-2">10K+</div>
              <div className="text-xs md:text-sm text-gray-400">Races Analyzed</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-1 md:mb-2">24/7</div>
              <div className="text-xs md:text-sm text-gray-400">Real-time Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">Ready to Transform Your Racing Strategy?</h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
            Join thousands of users who are leveraging AI to make smarter, data-driven betting decisions.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full">
                Register Now
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="text-white border-white hover:bg-white/10 text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
