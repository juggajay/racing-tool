'use client';

import React from 'react';
import Test from './test';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Horse Racing Website</h1>
      <p className="text-xl mb-8">Welcome to the Horse Racing Website!</p>
      <Test />
    </div>
  );
}