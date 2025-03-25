'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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

export default function NewDiscussionPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send the data to the server
    console.log({
      title,
      content,
      category: selectedCategory,
      tags
    });
    
    // Redirect to the community page (simulated)
    alert("Discussion created successfully!");
    window.location.href = "/community";
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/community">
          <Button variant="outline" size="sm">← Back to Community</Button>
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">New Discussion</span>
      </div>

      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-6">Create New Discussion</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium mb-2">Title</label>
            <Input
              id="title"
              placeholder="Enter a descriptive title for your discussion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/20"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block font-medium mb-2">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="tags" className="block font-medium mb-2">Tags</label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags (press Enter or click Add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="bg-white/5 border border-white/20"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                    <span className="text-sm">{tag}</span>
                    <button 
                      type="button"
                      className="ml-1 text-gray-400 hover:text-white"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block font-medium mb-2">Content</label>
            <textarea
              id="content"
              placeholder="Write your discussion here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-400">
              You can use basic HTML tags for formatting: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <Button type="button" variant="outline">Preview</Button>
              <Button type="button" variant="outline">Save Draft</Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/community">Cancel</Link>
              </Button>
              <Button 
                type="submit"
                disabled={!title.trim() || !content.trim() || !selectedCategory}
              >
                Create Discussion
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-bold mb-4">Community Guidelines</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Be respectful to other members of the community.</li>
          <li>Stay on topic and avoid posting irrelevant content.</li>
          <li>Do not post offensive, discriminatory, or inappropriate content.</li>
          <li>Avoid sharing personal information.</li>
          <li>Do not spam or post excessive self-promotion.</li>
          <li>Respect copyright and intellectual property rights.</li>
          <li>Follow all applicable laws and regulations.</li>
        </ul>
      </div>
      
      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}