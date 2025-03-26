import { NextRequest, NextResponse } from 'next/server';

// In a real application, you would use a database to store and retrieve discussions
// This is a simplified example for demonstration purposes
let DISCUSSIONS = [
  {
    id: '1',
    title: 'Melbourne Cup 2025 Early Predictions',
    author: 'RacingExpert',
    authorId: '1',
    date: 'Mar 25, 2025',
    content: `
      <p>With the Melbourne Cup 2025 still months away, I thought it would be interesting to start a discussion about early predictions and horses to watch.</p>
      
      <p>Based on recent form and performances in key lead-up races, here are my top 5 early contenders:</p>
      
      <ol>
        <li><strong>Northern Thunder</strong> - Impressive staying performances in Europe</li>
        <li><strong>Southern Star</strong> - Local hope with strong form over distance</li>
        <li><strong>Eastern Wind</strong> - Japanese raider with excellent credentials</li>
        <li><strong>Western Flame</strong> - Progressive stayer from leading stable</li>
        <li><strong>Central Power</strong> - Last year's runner-up looking to go one better</li>
      </ol>
      
      <p>What are your thoughts? Any early picks or dark horses to watch?</p>
    `,
    category: 'Race Analysis',
    tags: ['Melbourne Cup', 'Predictions'],
    views: 342,
    replies: 24,
    lastReply: '2 hours ago'
  }
];

export const runtime = 'edge';

// GET handler to retrieve all discussions
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would implement filtering, pagination, etc.
    return NextResponse.json({ discussions: DISCUSSIONS });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching discussions' },
      { status: 500 }
    );
  }
}

// POST handler to create a new discussion
export async function POST(request: NextRequest) {
  try {
    const { title, content, category, tags } = await request.json();
    
    // Validate input
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: 'Title, content, and category are required' },
        { status: 400 }
      );
    }
    
    // In a real application, you would:
    // 1. Get the user from the session/token
    // 2. Store the discussion in a database
    // 3. Handle tags, formatting, etc.
    
    // For this example, we'll simulate creating a new discussion
    const newDiscussion = {
      id: `${DISCUSSIONS.length + 1}`,
      title,
      author: 'CurrentUser', // In a real app, this would be the logged-in user
      authorId: '2', // In a real app, this would be the logged-in user's ID
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      content,
      category,
      tags: tags || [],
      views: 0,
      replies: 0,
      lastReply: 'Just now'
    };
    
    // In a real app, we would add the discussion to the database
    // For this demo, we'll add it to our in-memory array
    DISCUSSIONS = [newDiscussion, ...DISCUSSIONS];
    
    return NextResponse.json({
      message: 'Discussion created successfully',
      discussion: newDiscussion
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the discussion' },
      { status: 500 }
    );
  }
}