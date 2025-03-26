import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET handler to retrieve a specific discussion by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Mock discussion data for demonstration
    const discussion = {
      id: id,
      title: 'Melbourne Cup 2025 Early Predictions',
      author: 'RacingExpert',
      authorAvatar: 'RE',
      authorColor: 'from-indigo-600 to-purple-600',
      date: 'Mar 25, 2025',
      content: `<p>Discussion content for ID ${id}</p>`,
      category: 'Race Analysis',
      tags: ['Melbourne Cup', 'Predictions'],
      views: 342,
      likes: 28,
      pinned: true
    };
    
    return NextResponse.json({ discussion });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the discussion' },
      { status: 500 }
    );
  }
}