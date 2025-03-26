// API endpoint for fetching a single discussion by ID

// Sample discussion data (in a real app, this would come from a database)
const sampleDiscussions = [
  {
    id: "1",
    title: "Melbourne Cup 2025 Early Contenders",
    author: "RacingExpert",
    authorAvatar: "RE",
    authorColor: "from-indigo-600 to-purple-600",
    date: "Mar 24, 2025",
    time: "9:15 AM",
    views: 342,
    likes: 28,
    replies: 4,
    pinned: true,
    tags: ["Melbourne Cup", "Group 1", "Predictions"],
    content: `
      <p>With the Melbourne Cup still several months away, it's time to start looking at some early contenders for the race that stops a nation. Here's my shortlist of horses to watch:</p>
      
      <ol>
        <li><strong>Eastern Wind</strong> - Japanese stayer who impressed in the Tenno Sho. Has the stamina for 3200m.</li>
        <li><strong>Highland Warrior</strong> - Local hope who's been steadily improving. His trainer has indicated the Cup is the target.</li>
        <li><strong>Western Flame</strong> - Last year's runner-up. Has had a perfect preparation so far.</li>
        <li><strong>Northern Star</strong> - Lightly raced but highly talented. The distance is the question mark.</li>
        <li><strong>Southern Cross</strong> - Consistent performer who always runs well in staying races.</li>
      </ol>
      
      <p>What do you think of these selections? Any other horses you think should be on the radar?</p>
    `
  },
  {
    id: "2",
    title: "Melbourne Cup 2024 Results Analysis",
    author: "RacingExpert",
    authorAvatar: "RE",
    authorColor: "from-indigo-600 to-purple-600",
    date: "Nov 5, 2024",
    time: "4:30 PM",
    views: 1256,
    likes: 87,
    replies: 42,
    pinned: false,
    tags: ["Melbourne Cup", "Results", "Analysis"],
    content: `
      <p>What an incredible Melbourne Cup we witnessed today! Let's break down the results and what they mean for the future.</p>
      
      <p>The winner, Northern Star, defied all expectations with that incredible turn of foot in the final 200m. Few horses can accelerate like that after 3000m of racing.</p>
      
      <p>The European contingent performed below expectations, with only one placing in the top 5. Is this a sign that our local staying ranks are improving?</p>
      
      <p>The track played fairly, with winners coming from both on-pace and off-pace positions. The rain overnight didn't seem to affect the surface as much as predicted.</p>
      
      <p>What were your takeaways from the race?</p>
    `
  },
  {
    id: "3",
    title: "International Horses in Australian Racing",
    author: "FormAnalyst",
    authorAvatar: "FA",
    authorColor: "from-green-600 to-teal-600",
    date: "Feb 12, 2025",
    time: "11:20 AM",
    views: 876,
    likes: 54,
    replies: 28,
    pinned: false,
    tags: ["International", "Racing", "Analysis"],
    content: `
      <p>The influx of international horses into Australian racing has transformed our major carnivals over the past decade. Let's discuss the impact and what it means for local trainers and owners.</p>
      
      <p>Positives:</p>
      <ul>
        <li>Increased quality and competitiveness in our major races</li>
        <li>Greater international exposure for Australian racing</li>
        <li>Opportunity to measure our horses against the world's best</li>
      </ul>
      
      <p>Challenges:</p>
      <ul>
        <li>Harder for local horses to win major races</li>
        <li>Prize money flowing overseas</li>
        <li>Different veterinary and welfare standards across jurisdictions</li>
      </ul>
      
      <p>What's your view on international participation in our racing carnivals?</p>
    `
  },
  {
    id: "4",
    title: "Group 1 Races Calendar 2025",
    author: "RacingFan99",
    authorAvatar: "RF",
    authorColor: "from-red-600 to-orange-600",
    date: "Jan 5, 2025",
    time: "2:45 PM",
    views: 623,
    likes: 41,
    replies: 15,
    pinned: false,
    tags: ["Group 1", "Calendar", "2025"],
    content: `
      <p>Here's a comprehensive calendar of all Group 1 races in Australia for 2025. Save this for reference throughout the year!</p>
      
      <p><strong>Autumn Carnival</strong></p>
      <ul>
        <li>Feb 22 - C.F. Orr Stakes (1400m) - Caulfield</li>
        <li>Mar 1 - Blue Diamond Stakes (1200m) - Caulfield</li>
        <li>Mar 8 - Australian Guineas (1600m) - Flemington</li>
        <li>Mar 15 - Newmarket Handicap (1200m) - Flemington</li>
        <li>Mar 15 - Australian Cup (2000m) - Flemington</li>
        <li>Mar 22 - Golden Slipper (1200m) - Rosehill</li>
        <li>Mar 29 - Rosehill Guineas (2000m) - Rosehill</li>
        <li>Apr 5 - The BMW (2400m) - Rosehill</li>
        <li>Apr 12 - ATC Derby (2400m) - Randwick</li>
        <li>Apr 12 - T.J. Smith Stakes (1200m) - Randwick</li>
        <li>Apr 19 - Queen Elizabeth Stakes (2000m) - Randwick</li>
        <li>Apr 19 - Sydney Cup (3200m) - Randwick</li>
      </ul>
      
      <p><strong>Spring Carnival</strong></p>
      <ul>
        <li>Aug 30 - Memsie Stakes (1400m) - Caulfield</li>
        <li>Sep 13 - Makybe Diva Stakes (1600m) - Flemington</li>
        <li>Sep 27 - Underwood Stakes (1800m) - Caulfield</li>
        <li>Oct 4 - Turnbull Stakes (2000m) - Flemington</li>
        <li>Oct 11 - Caulfield Guineas (1600m) - Caulfield</li>
        <li>Oct 18 - Caulfield Cup (2400m) - Caulfield</li>
        <li>Oct 25 - Cox Plate (2040m) - Moonee Valley</li>
        <li>Nov 1 - Victoria Derby (2500m) - Flemington</li>
        <li>Nov 4 - Melbourne Cup (3200m) - Flemington</li>
        <li>Nov 8 - VRC Sprint Classic (1200m) - Flemington</li>
        <li>Nov 8 - Mackinnon Stakes (2000m) - Flemington</li>
      </ul>
      
      <p>Let me know if I've missed any or if there are date changes!</p>
    `
  }
];

export async function GET(request, { params }) {
  try {
    const discussionId = params.id;
    
    // In a real app, you would fetch the discussion from a database
    // For now, we'll use the sample data
    const discussion = sampleDiscussions.find(d => d.id === discussionId);
    
    if (!discussion) {
      return Response.json(
        { error: 'Discussion not found' },
        { status: 404 }
      );
    }
    
    // Simulate a slight delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Response.json({ 
      success: true,
      discussion
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return Response.json(
      { error: 'Failed to fetch discussion' },
      { status: 500 }
    );
  }
}