'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

// Sample comments (in a real app, these would come from the API too)
const sampleComments = [
  {
    id: 1,
    author: "BettingPro",
    authorAvatar: "BP",
    authorColor: "from-purple-600 to-blue-600",
    date: "Mar 25, 2025",
    time: "10:32 AM",
    content: "Great list! I'd add Midnight Runner to that list. His recent form suggests he's being prepared for a Cup campaign.",
    likes: 12,
    replies: []
  },
  {
    id: 2,
    author: "FormAnalyst",
    authorAvatar: "FA",
    authorColor: "from-green-600 to-teal-600",
    date: "Mar 25, 2025",
    time: "11:45 AM",
    content: "I'm not convinced about Western Flame. The stable has indicated they might target shorter races this season.",
    likes: 8,
    replies: [
      {
        id: 21,
        author: "RacingExpert",
        authorAvatar: "RE",
        authorColor: "from-indigo-600 to-purple-600",
        date: "Mar 25, 2025",
        time: "12:15 PM",
        content: "That's interesting - I hadn't heard that. Do you have a source for that information?",
        likes: 3
      },
      {
        id: 22,
        author: "FormAnalyst",
        authorAvatar: "FA",
        authorColor: "from-green-600 to-teal-600",
        date: "Mar 25, 2025",
        time: "12:38 PM",
        content: "It was mentioned in an interview with the trainer last week in Racing Daily. I'll try to find the link.",
        likes: 2
      }
    ]
  },
  {
    id: 3,
    author: "NewToRacing",
    authorAvatar: "NT",
    authorColor: "from-yellow-600 to-orange-600",
    date: "Mar 25, 2025",
    time: "1:20 PM",
    content: "What about international raiders? Any horses from Europe or Japan that might make the trip this year?",
    likes: 5,
    replies: [
      {
        id: 31,
        author: "RacingExpert",
        authorAvatar: "RE",
        authorColor: "from-indigo-600 to-purple-600",
        date: "Mar 25, 2025",
        time: "1:45 PM",
        content: "Eastern Wind from Japan is already on my list, but there are rumors that Irish trainer O'Brien might send 2-3 horses this year. Too early to know which ones though.",
        likes: 7
      }
    ]
  },
  {
    id: 4,
    author: "WeatherWatcher",
    authorAvatar: "WW",
    authorColor: "from-blue-600 to-cyan-600",
    date: "Mar 25, 2025",
    time: "3:05 PM",
    content: "Long-range weather forecasts suggest we might have a wet spring. Worth keeping an eye on horses with good form on soft/heavy tracks.",
    likes: 15,
    replies: []
  }
];

export default function DiscussionPage() {
  const params = useParams();
  const discussionId = params.id;
  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(sampleComments);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  
  // Fetch discussion data from API
  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/community/discussions/${discussionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch discussion');
        }
        
        const data = await response.json();
        setDiscussion(data.discussion);
      } catch (err) {
        console.error('Error fetching discussion:', err);
        setError('Failed to load discussion. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (discussionId) {
      fetchDiscussion();
    }
  }, [discussionId]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: comments.length + 1,
      author: "CurrentUser",
      authorAvatar: "CU",
      authorColor: "from-red-600 to-pink-600",
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: newComment,
      likes: 0,
      replies: []
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };
  
  const handleAddReply = (commentId) => {
    if (!replyContent.trim()) return;
    
    const newReply = {
      id: Date.now(),
      author: "CurrentUser",
      authorAvatar: "CU",
      authorColor: "from-red-600 to-pink-600",
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: replyContent,
      likes: 0
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyContent("");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/community">
            <Button variant="outline" size="sm">← Back to Community</Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading discussion...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/community">
            <Button variant="outline" size="sm">← Back to Community</Button>
          </Link>
        </div>
        <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" asChild>
            <Link href="/community">Return to Community</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!discussion) {
    return (
      <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/community">
            <Button variant="outline" size="sm">← Back to Community</Button>
          </Link>
        </div>
        <div className="bg-yellow-900/50 border border-yellow-500 text-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-2">Discussion Not Found</h2>
          <p>The discussion you're looking for could not be found.</p>
          <Button className="mt-4" asChild>
            <Link href="/community">Return to Community</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/community">
          <Button variant="outline" size="sm">← Back to Community</Button>
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">Discussion</span>
      </div>

      {/* Discussion Header */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${discussion.authorColor} rounded-full flex items-center justify-center text-lg font-bold`}>
            {discussion.authorAvatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {discussion.pinned && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Pinned</span>
              )}
              <h1 className="text-xl md:text-2xl font-bold">{discussion.title}</h1>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {discussion.tags && discussion.tags.map(tag => (
                <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 text-sm text-gray-400">
              <span>By {discussion.author}</span>
              <span>Started {discussion.date}</span>
              <span>{discussion.views} views</span>
              <span>{discussion.likes} likes</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-white/10 pt-4">
          <div 
            className="prose prose-invert max-w-none prose-p:my-2 prose-ol:my-2 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: discussion.content }}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12l10-6.5V3L7 10z"></path>
              </svg>
              Like
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Reply
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </Button>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
            More
          </Button>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-bold mb-4">Comments ({comments.length})</h2>
        
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${comment.authorColor} rounded-full flex items-center justify-center text-sm font-bold`}>
                  {comment.authorAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{comment.author}</span>
                    <span className="text-xs text-gray-400">{comment.date} at {comment.time}</span>
                  </div>
                  <div className="mt-2">
                    {comment.content}
                  </div>
                  <div className="mt-2 flex gap-4">
                    <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12l10-6.5V3L7 10z"></path>
                      </svg>
                      {comment.likes}
                    </button>
                    <button 
                      className="text-sm text-gray-400 hover:text-white"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-white/5 border border-white/20"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        Post
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {/* Nested Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l border-white/10 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${reply.authorColor} rounded-full flex items-center justify-center text-xs font-bold`}>
                            {reply.authorAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold">{reply.author}</span>
                              <span className="text-xs text-gray-400">{reply.date} at {reply.time}</span>
                            </div>
                            <div className="mt-1">
                              {reply.content}
                            </div>
                            <div className="mt-1">
                              <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M7 10v12l10-6.5V3L7 10z"></path>
                                </svg>
                                {reply.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Comment Form */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Add Your Comment</h3>
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Discussions */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-bold mb-4">Related Discussions</h2>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
            <Link href="/community/discussion/2" className="font-bold hover:text-blue-400">
              Melbourne Cup 2024 Results Analysis
            </Link>
            <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-400">
              <span>By RacingExpert</span>
              <span>Nov 5, 2024</span>
              <span>42 replies</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
            <Link href="/community/discussion/3" className="font-bold hover:text-blue-400">
              International Horses in Australian Racing
            </Link>
            <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-400">
              <span>By FormAnalyst</span>
              <span>Feb 12, 2025</span>
              <span>28 replies</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
            <Link href="/community/discussion/4" className="font-bold hover:text-blue-400">
              Group 1 Races Calendar 2025
            </Link>
            <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-400">
              <span>By RacingFan99</span>
              <span>Jan 5, 2025</span>
              <span>15 replies</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}