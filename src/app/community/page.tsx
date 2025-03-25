'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

// Sample data for discussions
const sampleDiscussions = [
  {
    id: 1,
    title: "Melbourne Cup 2025 Early Predictions",
    author: "RacingExpert",
    date: "Mar 25, 2025",
    replies: 24,
    views: 342,
    lastReply: "2 hours ago",
    tags: ["Melbourne Cup", "Predictions"],
    pinned: true
  },
  {
    id: 2,
    title: "Best strategies for value betting in handicap races?",
    author: "BettingPro",
    date: "Mar 24, 2025",
    replies: 18,
    views: 215,
    lastReply: "5 hours ago",
    tags: ["Betting", "Strategy", "Handicap"],
    pinned: false
  },
  {
    id: 3,
    title: "How important is the jockey vs. the horse?",
    author: "NewToRacing",
    date: "Mar 23, 2025",
    replies: 32,
    views: 287,
    lastReply: "Yesterday",
    tags: ["Jockeys", "Analysis"],
    pinned: false
  },
  {
    id: 4,
    title: "Weather impact on track conditions - Discussion",
    author: "WeatherWatcher",
    date: "Mar 22, 2025",
    replies: 15,
    views: 178,
    lastReply: "2 days ago",
    tags: ["Weather", "Track Conditions"],
    pinned: false
  },
  {
    id: 5,
    title: "First-time runners: How to assess potential?",
    author: "FormAnalyst",
    date: "Mar 21, 2025",
    replies: 27,
    views: 231,
    lastReply: "3 days ago",
    tags: ["Form Analysis", "First-timers"],
    pinned: false
  },
  {
    id: 6,
    title: "The Cox Plate 2025 - Early contenders",
    author: "RacingFan99",
    date: "Mar 20, 2025",
    replies: 21,
    views: 198,
    lastReply: "4 days ago",
    tags: ["Cox Plate", "Group 1"],
    pinned: false
  },
  {
    id: 7,
    title: "Using AI for race predictions - Experiences?",
    author: "TechRacer",
    date: "Mar 19, 2025",
    replies: 29,
    views: 312,
    lastReply: "5 days ago",
    tags: ["AI", "Technology", "Predictions"],
    pinned: false
  },
  {
    id: 8,
    title: "Best racing venues in Australia - Your top 3?",
    author: "TrackEnthusiast",
    date: "Mar 18, 2025",
    replies: 42,
    views: 356,
    lastReply: "6 days ago",
    tags: ["Venues", "Racecourses"],
    pinned: false
  }
];

// Sample categories
const categories = [
  { name: "General Discussion", count: 156 },
  { name: "Race Analysis", count: 89 },
  { name: "Betting Strategies", count: 112 },
  { name: "Form & Statistics", count: 74 },
  { name: "Jockeys & Trainers", count: 63 },
  { name: "International Racing", count: 47 },
  { name: "Technology & Tools", count: 38 },
  { name: "Beginners Corner", count: 52 }
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Filter discussions based on search query and selected category
  const filteredDiscussions = sampleDiscussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || discussion.tags.some(tag => 
      tag.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Community</h1>
        <div className="flex flex-wrap w-full sm:w-auto gap-2">
          <Link href="/community/new" className="w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">New Discussion</Button>
          </Link>
        </div>
      </div>

      {/* Community Header */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Welcome to the Racing Community</h2>
            <p className="opacity-80">
              Join discussions about horse racing, share insights, and connect with fellow racing enthusiasts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 min-w-[280px]">
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/20"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-white/10 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-3 pb-2 border-b border-white/10">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.name} className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedCategory(category.name)}
                    className={`text-left hover:text-blue-400 ${selectedCategory === category.name ? 'text-blue-400' : ''}`}
                  >
                    {category.name}
                  </button>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community Stats */}
          <div className="bg-white/10 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-3 pb-2 border-b border-white/10">Community Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Members:</span>
                <span>2,458</span>
              </div>
              <div className="flex justify-between">
                <span>Discussions:</span>
                <span>631</span>
              </div>
              <div className="flex justify-between">
                <span>Comments:</span>
                <span>8,742</span>
              </div>
              <div className="flex justify-between">
                <span>Online Now:</span>
                <span className="text-green-400">42</span>
              </div>
            </div>
          </div>
          
          {/* Active Members */}
          <div className="bg-white/10 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-3 pb-2 border-b border-white/10">Top Contributors</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">RE</div>
                <span>RacingExpert</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-auto">124 posts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">BP</div>
                <span>BettingPro</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-auto">98 posts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">FA</div>
                <span>FormAnalyst</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-auto">87 posts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">TR</div>
                <span>TechRacer</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-auto">76 posts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">WW</div>
                <span>WeatherWatcher</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-auto">65 posts</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Discussion List */}
        <div className="md:col-span-3">
          <div className="bg-white/10 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Discussions</h3>
              <div className="flex gap-2">
                <select className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Latest Activity</option>
                  <option>Most Replies</option>
                  <option>Most Views</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            {/* Discussion List */}
            <div className="space-y-2">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map(discussion => (
                  <div 
                    key={discussion.id} 
                    className={`p-3 rounded-lg ${discussion.pinned ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {discussion.author.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {discussion.pinned && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Pinned</span>
                          )}
                          <Link href={`/community/discussion/${discussion.id}`} className="font-bold hover:text-blue-400">
                            {discussion.title}
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {discussion.tags.map(tag => (
                            <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-gray-400">
                          <span>By {discussion.author}</span>
                          <span>Started {discussion.date}</span>
                          <span>{discussion.replies} replies</span>
                          <span>{discussion.views} views</span>
                          <span>Last reply {discussion.lastReply}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No discussions found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-white/10">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">...</Button>
                <Button variant="outline" size="sm">8</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}