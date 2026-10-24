export const CATEGORY_CHIPS = [
  { id: "all", label: "All", icon: "✨" },
  { id: "movies", label: "Movies", icon: "🎬" },
  { id: "songs", label: "Songs", icon: "🎵" },
  { id: "places", label: "Places", icon: "📍" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "events", label: "Events", icon: "🎉" },
  { id: "lifestyle", label: "Lifestyle", icon: "✨" },
  { id: "sports", label: "Sports", icon: "🏆" },
  { id: "resources", label: "Resources", icon: "📚" },
  { id: "general", label: "General", icon: "💬" },
];

export const TOPIC_CATEGORIES = {
  "AI Tools": "general",
  "Tech & Dev Kits": "general",
  "Live Gigs & Concerts": "events",
  "Tech Meetups": "events",
  "College Fests": "events",
  "Local Watch Parties": "events",
  Hackathons: "events",
  "Room Aesthetics & Desk Setup": "lifestyle",
  "Skincare & Grooming": "lifestyle",
  "Healthy Routines": "lifestyle",
  "Life Hacks": "lifestyle",
  "Hidden Gems": "lifestyle",
  "Cozy Cafes": "places",
  "Late-Night Eats": "places",
  "Thrift & Clothes": "places",
  "Study Spots": "places",
  "Budget Travel": "places",
  "Mind-Bending": "movies",
  "Psychological Thriller": "movies",
  "Dark Comedy": "movies",
  "Comfort Watch": "movies",
  "Plot Twists": "movies",
};

export const FILTER_GROUPS = [
  {
    id: "tech",
    label: "Tech",
    topics: ["AI Tools", "Tech & Dev Kits"],
  },
  {
    id: "events",
    label: "🎉 Events",
    topics: [
      "Live Gigs & Concerts",
      "Tech Meetups",
      "College Fests",
      "Local Watch Parties",
      "Hackathons",
    ],
  },
  {
    id: "lifestyle",
    label: "✨ Lifestyle & General",
    topics: [
      "Room Aesthetics & Desk Setup",
      "Skincare & Grooming",
      "Healthy Routines",
      "Life Hacks",
      "Hidden Gems",
    ],
  },
  {
    id: "places",
    label: "📍 Places",
    topics: [
      "Cozy Cafes",
      "Late-Night Eats",
      "Thrift & Clothes",
      "Study Spots",
      "Budget Travel",
    ],
  },
  {
    id: "movies",
    label: "🎬 Movies",
    topics: [
      "Mind-Bending",
      "Psychological Thriller",
      "Dark Comedy",
      "Comfort Watch",
      "Plot Twists",
    ],
  },
];

export const INITIAL_FEED = [
  {
    id: "rec-1",
    type: "recommendation",
    category: "places",
    author: "Aanya Rao",
    handle: "AR",
    rank: "Lvl 4 Tastemaker",
    title: "Third Wave Coffee — Koramangala",
    quote: "Best flat white in town. Quiet corner to read or work.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    upvotes: 677,
    comments: 14,
    recommendedBy: "@aanya",
  },
  {
    id: "showdown-1",
    type: "showdown",
    category: "movies",
    author: "jun",
    handle: "AJ",
    title: "Which movie had the most unhinged plot twist?",
    left: {
      id: "fight-club",
      title: "Fight Club",
      subtitle: "Pure chaos hiding in plain sight.",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      votes: 198,
    },
    right: {
      id: "memento",
      title: "Memento",
      subtitle: "A puzzle that rewires your brain.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      votes: 149,
    },
    comments: 32,
    votes: 347,
    endsIn: "12h",
  },
  {
    id: "rec-2",
    type: "recommendation",
    category: "resources",
    author: "Noah Chen",
    handle: "NC",
    rank: "Lvl 3 Curator",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    quote: "A love letter to games, friendship, and building worlds together.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    upvotes: 412,
    comments: 28,
    recommendedBy: "@noah",
  },
  {
    id: "rec-3",
    type: "recommendation",
    category: "movies",
    author: "MayaR",
    handle: "MR",
    rank: "Lvl 5 Curator",
    title: "Shutter Island",
    quote: "Rewatch it once you think you know the ending.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    upvotes: 890,
    comments: 41,
    recommendedBy: "@maya",
  },
  {
    id: "rec-4",
    type: "recommendation",
    category: "movies",
    author: "Alex",
    handle: "AX",
    rank: "Lvl 2 Scout",
    title: "The Nice Guys",
    quote: "The most rewatchable buddy comedy of the last decade.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80",
    upvotes: 255,
    comments: 9,
    recommendedBy: "@alex",
  },
  {
    id: "rec-5",
    type: "recommendation",
    category: "movies",
    author: "Arya",
    handle: "AY",
    rank: "Lvl 4 Tastemaker",
    title: "Donnie Darko",
    quote: "Cult classic energy. Perfect late-night rabbit hole.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    upvotes: 501,
    comments: 19,
    recommendedBy: "@arya",
  },
  {
    id: "rec-6",
    type: "recommendation",
    category: "finance",
    author: "JordanR",
    handle: "JR",
    rank: "Lvl 6 Money Master",
    title: "5 ETF Portfolios for Beginners",
    quote: "Simple allocations you can actually stick with.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    upvotes: 312,
    comments: 22,
    recommendedBy: "@jordan",
  },
  {
    id: "rec-7",
    type: "recommendation",
    category: "songs",
    author: "NinaT",
    handle: "NT",
    rank: "Lvl 3 Maestro",
    title: "Featherstone — The Paper Kites",
    quote: "Soft, rainy-day folk that never gets old.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    upvotes: 210,
    comments: 11,
    recommendedBy: "@nina",
  },
  {
    id: "rec-8",
    type: "recommendation",
    category: "sports",
    author: "DevB",
    handle: "DB",
    rank: "Lvl 2 MVP",
    title: "Monaco GP 2021 Overtake Highlights",
    quote: "The kind of racing clip you send to a group chat.",
    image:
      "https://images.unsplash.com/photo-1541447274883-26c5d0d35911?auto=format&fit=crop&w=1200&q=80",
    upvotes: 168,
    comments: 7,
    recommendedBy: "@dev",
  },
];

export const SAVED_DEFAULT_IDS = ["rec-1", "rec-3", "rec-2", "rec-4", "rec-5"];

export const WEEKLY_CHAMPIONS = [
  { id: "1", handle: "MR", name: "MayaR", xp: 420, streak: 18, days: "18 days" },
  { id: "2", handle: "A9", name: "Alex99", xp: 340, streak: 14, days: "14 days" },
  { id: "3", handle: "SK", name: "SamK", xp: 310, streak: 12, days: "12 days" },
];

export const TOP_PLAYERS = [
  { rank: 4, handle: "JR", name: "JordanR", xp: 285, days: "10 days" },
  { rank: 5, handle: "NT", name: "NinaT", xp: 260, days: "8 days" },
  { rank: 6, handle: "DB", name: "DevB", xp: 240, days: "8 days" },
  { rank: 7, handle: "LK", name: "LeahK", xp: 228, days: "7 days" },
  { rank: 8, handle: "PS", name: "PriyaS", xp: 214, days: "6 days" },
  { rank: 9, handle: "OM", name: "OmarM", xp: 201, days: "6 days" },
  { rank: 10, handle: "CW", name: "ChrisW", xp: 188, days: "5 days" },
];

export const DEBATE_XP_REQUIRED = 1000;

export const DEBATE_NOUNS = {
  movies: "Movie",
  songs: "Song",
  places: "Place",
  finance: "Finance",
  events: "Event",
  lifestyle: "Lifestyle",
  sports: "Sports",
  resources: "Book",
  general: "General",
};

const TECH_TOPICS = new Set(["AI Tools", "Tech & Dev Kits"]);

export function getDebateNoun(category, selectedTopics = []) {
  if (selectedTopics.length) {
    if (selectedTopics.every((topic) => TECH_TOPICS.has(topic))) return "Tech";
    const cats = [
      ...new Set(selectedTopics.map((topic) => TOPIC_CATEGORIES[topic]).filter(Boolean)),
    ];
    if (cats.length === 1) return DEBATE_NOUNS[cats[0]] || "";
  }
  return DEBATE_NOUNS[category] || "";
}

export const NOTIFICATIONS = [
  {
    id: "n1",
    title: "New upvote",
    body: "MayaR upvoted your pick Shutter Island",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Quiz reminder",
    body: "Today’s quiz is live — keep your streak going",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Showdown ending soon",
    body: "Fight Club vs Memento closes in 12 hours",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n4",
    title: "Trending save",
    body: "Third Wave Coffee is climbing the feed",
    time: "Yesterday",
    unread: false,
  },
];

export const LEVELS = [
  { level: 1, title: "Scout", detail: "Exploring the discovery journey", xp: 0 },
  { level: 5, title: "Explorer", detail: "Active community contributor", xp: 500 },
  { level: 10, title: "Curator", detail: "Consistently notable taste", xp: 2000, current: true },
  { level: 15, title: "Tastemaker", detail: "Influential community voice", xp: 5000 },
  { level: 20, title: "Master of Taste", detail: "Legendary across multiple categories", xp: 10000 },
];

export const BADGES = [
  { id: "grand", name: "Grand Curator", meta: "4,000+ votes", icon: "🏅", tone: "gold" },
  { id: "streak", name: "Streak Master", meta: "7-day quiz streak", icon: "🔥", tone: "orange" },
  { id: "crowd", name: "Crowd Favorite", meta: "100+ upvotes", icon: "💛", tone: "gold" },
];

export const GENRE_MASTERY = [
  { id: "cinephile", name: "Cinephile", meta: "Movies", icon: "🎬" },
  { id: "maestro", name: "Maestro", meta: "Songs & Music", icon: "🎵" },
  { id: "wanderer", name: "Wanderer", meta: "Places & cafes", icon: "📍" },
  { id: "mvp", name: "MVP", meta: "Sports", icon: "🏆" },
  { id: "money", name: "Money Master", meta: "Finance", icon: "💸" },
  { id: "scholar", name: "Scholar", meta: "Resources", icon: "📖" },
  { id: "trendsetter", name: "Trendsetter", meta: "Lifestyle", icon: "✨" },
  { id: "insider", name: "Insider", meta: "Events", icon: "🎟️" },
];

export const QUIZ_QUESTION = {
  number: 42,
  prompt: "Which cafe in Koramangala is most recommended this week?",
  options: [
    "Third Wave Coffee",
    "Blue Tokai",
    "Café Coffee Day",
    "Starbucks Indiranagar",
  ],
  answer: 0,
  xp: 15,
  seconds: 30,
};
