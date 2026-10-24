import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { DEBATE_XP_REQUIRED, getDebateNoun, INITIAL_FEED, SAVED_DEFAULT_IDS, TOPIC_CATEGORIES } from "./data";
import { createPost, getPosts, upvotePost } from "./api"; // <-- Live Firebase Database API
import { auth } from "./firebase";
import {
  logOut,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  subscribeToAuthChanges,
} from "./unAuth";
import LoginScreen from "./components/LoginScreen";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import ChampionsScreen from "./screens/ChampionsScreen";
import QuizzesScreen from "./screens/QuizzesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SavedPicksScreen from "./screens/SavedPicksScreen";
import FilterSheet from "./screens/FilterSheet";
import AddRecommendationModal from "./screens/AddRecommendationModal";
import ShowdownModal from "./screens/ShowdownModal";

const MOCK_USER = {
  uid: "preview",
  displayName: "Arya Gupta",
  email: "arya@community.app",
  photoURL: null,
};

function usePreviewFlag() {
  const [preview, setPreview] = useState(
    () => process.env.NODE_ENV === "development" && window.location.hash === "#preview"
  );

  useEffect(() => {
    const sync = () =>
      setPreview(process.env.NODE_ENV === "development" && window.location.hash === "#preview");
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return preview;
}

function App() {
  const preview = usePreviewFlag();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState("home");
  const [category, setCategory] = useState("all");
  const [feed, setFeed] = useState([]);

  // Fetch live posts from Firebase Firestore on startup
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        const livePosts = await getPosts();
        if (livePosts && livePosts.length > 0) {
          setFeed(livePosts);
        } else {
          setFeed(INITIAL_FEED); // Fallback to mock data if Firestore is empty
        }
      } catch (err) {
        console.error("Failed to load posts from database:", err);
        setFeed(INITIAL_FEED);
      }
    };
    loadFirebaseData();
  }, []);

  const [savedIds, setSavedIds] = useState(SAVED_DEFAULT_IDS);
  const [watchedIds, setWatchedIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [showdownOpen, setShowdownOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [topics, setTopics] = useState([]);
  const [votes, setVotes] = useState({});
  const [votedIds, setVotedIds] = useState([]);
  const [notesRead, setNotesRead] = useState(false);
  const [quizXp, setQuizXp] = useState(120);
  const [totalXp, setTotalXp] = useState(4820);

  useEffect(() => {
    if (preview) {
      setUser(MOCK_USER);
      setLoading(false);
      return undefined;
    }
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [preview]);

  useEffect(() => {
    if (!user?.uid) return;
    const raw = localStorage.getItem(`picks:${user.uid}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.savedIds) setSavedIds(parsed.savedIds);
        if (parsed.watchedIds) setWatchedIds(parsed.watchedIds);
        if (parsed.quizXp) setQuizXp(parsed.quizXp);
        if (parsed.totalXp) setTotalXp(parsed.totalXp);
        if (parsed.votedIds) setVotedIds(parsed.votedIds);
        if (parsed.votes) setVotes(parsed.votes);
        if (parsed.notesRead) setNotesRead(true);
      } catch {
        /* ignore */
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    localStorage.setItem(
      `picks:${user.uid}`,
      JSON.stringify({ savedIds, watchedIds, quizXp, totalXp, votedIds, votes, notesRead })
    );
  }, [user?.uid, savedIds, watchedIds, quizXp, totalXp, votedIds, votes, notesRead]);

  const runAuth = async (action) => {
    setAuthError("");
    try {
      await action();
    } catch (error) {
      console.error("Auth failed:", error);
      setAuthError(friendlyAuthError(error));
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      if (!preview) await logOut();
      if (preview && window.location.hash === "#preview") {
        window.location.hash = "";
      }
      setUser(null);
      setTab("home");
      setShowSaved(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleSave = (id) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const applyUpvote = async (id, shouldVote) => {
    // If it's a database post (doesn't start with mine- or rec-), call Firestore upvote
    if (!id.toString().startsWith("mine-") && !id.toString().startsWith("rec-")) {
      try {
        await upvotePost(id);
      } catch (err) {
        console.error("Database upvote failed", err);
      }
    }

    setVotedIds((current) => {
      const voted = current.includes(id);
      if (shouldVote === voted) return current;
      return shouldVote ? [...current, id] : current.filter((item) => item !== id);
    });

    // Increment local feed count instantly for responsiveness
    setFeed((currentFeed) =>
      currentFeed.map((item) => {
        if (item.id === id) {
          const delta = shouldVote ? 1 : -1;
          return { ...item, upvotes: (item.upvotes || 0) + delta };
        }
        return item;
      })
    );
  };

  const toggleUpvote = (id) => {
    applyUpvote(id, !votedIds.includes(id));
  };

  const markWatched = (id, liked) => {
    setWatchedIds((current) => (current.includes(id) ? current : [...current, id]));
    if (liked) applyUpvote(id, true);
  };

  const savedItems = useMemo(
    () => feed.filter((item) => item.type === "recommendation" && savedIds.includes(item.id)),
    [feed, savedIds]
  );

  const topicCategories = useMemo(
    () => [...new Set(topics.map((topic) => TOPIC_CATEGORIES[topic]).filter(Boolean))],
    [topics]
  );

  const myPicks = useMemo(() => {
    const ownName = user?.displayName;
    return feed.filter(
      (item) =>
        item.type === "recommendation" &&
        (item.mine || item.author === ownName || ["rec-6", "rec-1", "rec-7", "rec-8"].includes(item.id))
    );
  }, [feed, user]);

  const addRecommendation = async ({ category: nextCategory, title, reason, image }) => {
    const next = {
      id: `mine-${Date.now()}`,
      type: "recommendation",
      category: nextCategory,
      author: user?.displayName || "You",
      handle: getInitials(user),
      rank: "Lvl 12 Curator",
      title,
      quote: reason,
      caption: reason,
      image:
        image ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      imageUrl:
        image ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      upvotes: 1,
      comments: 0,
      recommendedBy: user?.email ? `@${user.email.split("@")[0]}` : "@you",
      mine: true,
    };
    setFeed((current) => [next, ...current]);
    setTotalXp((xp) => xp + 15);
    setTab("home");
    setCategory("all");

    if (user && !preview && auth?.currentUser) {
      try {
        await createPost(nextCategory, title, reason, next.image);
      } catch (err) {
        console.error("Database save failed:", err);
      }
    }
  };

  const debateNoun = useMemo(() => getDebateNoun(category, topics), [category, topics]);
  const canDebate = totalXp >= DEBATE_XP_REQUIRED;

  const addShowdown = ({ question, left, right }) => {
    const nextCategory =
      category !== "all"
        ? category
        : TOPIC_CATEGORIES[topics[0]] || "general";
    const next = {
      id: `showdown-${Date.now()}`,
      type: "showdown",
      category: nextCategory,
      author: user?.displayName?.split(" ")[0]?.toLowerCase() || "you",
      handle: getInitials(user),
      title: question,
      left: {
        id: "left",
        title: left,
        subtitle: "Your pick",
        image:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
        votes: 0,
      },
      right: {
        id: "right",
        title: right,
        subtitle: "The challenger",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
        votes: 0,
      },
      comments: 0,
      votes: 0,
      endsIn: "24h",
    };
    setFeed((current) => [next, ...current]);
    setTotalXp((xp) => xp + 10);
    setTab("home");
    if (nextCategory !== "all") setCategory(nextCategory);
  };

  const phone = (content) => (
    <div className="stage">
      <div className="phone">
        <div className="status-bar" aria-hidden="true">
          <span>9:41</span>
          <span className="island" />
          <span>📶 🔋</span>
        </div>
        {content}
      </div>
    </div>
  );

  if (loading) {
    return phone(
      <div className="screen center-screen">
        <p>Loading your picks…</p>
      </div>
    );
  }

  if (!user) {
    return phone(
      <LoginScreen
        error={authError}
        onGoogleSignIn={() => runAuth(signInWithGoogle)}
        onEmailSignIn={(email, password) => runAuth(() => signInWithEmail(email, password))}
        onEmailSignUp={(email, password, name) =>
          runAuth(() => signUpWithEmail(email, password, name))
        }
        onResetPassword={(email) => runAuth(() => resetPassword(email))}
      />
    );
  }

  return phone(
    <>
      <div className="phone-body">
        {showSaved ? (
          <SavedPicksScreen
            items={savedItems}
            watchedIds={watchedIds}
            onBack={() => setShowSaved(false)}
            onUnsave={toggleSave}
            onMarkWatched={markWatched}
            onUnmarkWatched={(id) =>
              setWatchedIds((current) => current.filter((item) => item !== id))
            }
          />
        ) : (
          <>
            {tab === "home" && (
              <HomeScreen
                user={user}
                feed={feed}
                category={category}
                topics={topicCategories}
                onCategory={setCategory}
                onOpenFilters={() => setFilterOpen(true)}
                onOpenPost={() => setPostOpen(true)}
                onCreateShowdown={() => canDebate && setShowdownOpen(true)}
                debateNoun={debateNoun}
                canDebate={canDebate}
                debateXpRequired={DEBATE_XP_REQUIRED}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                votedIds={votedIds}
                onUpvote={toggleUpvote}
                votes={votes}
                notesRead={notesRead}
                onOpenNotifications={() => setNotesRead(true)}
                onVote={(id, choice) => {
                  setVotes((current) => {
                    if (current[id] === choice) return current;
                    return { ...current, [id]: choice };
                  });
                }}
              />
            )}
            {tab === "champions" && <ChampionsScreen user={user} quizXp={quizXp} />}
            {tab === "quizzes" && (
              <QuizzesScreen
                user={user}
                quizXp={quizXp}
                onOpenLeaderboard={() => setTab("champions")}
                onCompleteQuiz={(xp) => {
                  setQuizXp((current) => current + xp);
                  setTotalXp((current) => current + xp);
                }}
              />
            )}
            {tab === "profile" && (
              <ProfileScreen
                user={user}
                totalXp={totalXp}
                picks={myPicks}
                savedCount={savedIds.length}
                onOpenSaved={() => setShowSaved(true)}
                onSignOut={handleSignOut}
              />
            )}
          </>
        )}
      </div>

      <BottomNav
        active={showSaved ? "profile" : tab}
        onChange={(next) => {
          setShowSaved(false);
          setTab(next);
        }}
        onPost={() => setPostOpen(true)}
      />

      <FilterSheet
        open={filterOpen}
        selected={topics}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setTopics(next);
          setCategory("all");
          setFilterOpen(false);
        }}
      />
      <AddRecommendationModal
        open={postOpen}
        onClose={() => setPostOpen(false)}
        onSubmit={addRecommendation}
      />
      <ShowdownModal
        open={showdownOpen}
        debateNoun={debateNoun}
        onClose={() => setShowdownOpen(false)}
        onSubmit={addShowdown}
      />
    </>
  );
}

function getInitials(user) {
  const name = user?.displayName || user?.email || "YO";
  const parts = name.replace(/@.*/, "").split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function friendlyAuthError(error) {
  const code = error?.code || "";
  if (code.includes("popup-closed")) return "Sign-in popup was closed.";
  if (code.includes("email-already-in-use")) return "That email already has an account.";
  if (code.includes("invalid-credential") || code.includes("wrong-password")) {
    return "Email or password is incorrect.";
  }
  if (code.includes("user-not-found")) return "No account found for that email.";
  if (code.includes("weak-password")) return "Use at least 6 characters for the password.";
  return error.message || "Sign in failed. Try again.";
}

export default App;