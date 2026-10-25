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

export const INITIAL_FEED = [];

export const SAVED_DEFAULT_IDS = [];

export const WEEKLY_CHAMPIONS = [];

export const TOP_PLAYERS = [];

export const DEBATE_XP_REQUIRED = 0;

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

export const NOTIFICATIONS = [];

export const LEVELS = [
  { level: 1, title: "Scout", detail: "Exploring the discovery journey", xp: 0 },
  { level: 5, title: "Explorer", detail: "Active community contributor", xp: 500 },
  { level: 10, title: "Curator", detail: "Consistently notable taste", xp: 2000 },
  { level: 15, title: "Tastemaker", detail: "Influential community voice", xp: 5000 },
  { level: 20, title: "Master of Taste", detail: "Legendary across multiple categories", xp: 10000 },
];

export const BADGES = [
  { id: "grand", name: "Grand Curator", meta: "4,000+ votes", icon: "🏅", tone: "gold", reqUpvotes: 4000 },
  { id: "streak", name: "Streak Master", meta: "7-day quiz streak", icon: "🔥", tone: "orange", reqStreak: 7 },
  { id: "crowd", name: "Crowd Favorite", meta: "100+ upvotes", icon: "💛", tone: "gold", reqUpvotes: 100 },
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

export const QUIZ_QUESTION = null;
