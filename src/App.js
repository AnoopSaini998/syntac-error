import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { INITIAL_FEED, SAVED_DEFAULT_IDS, TOPIC_CATEGORIES } from "./data";
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
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [savedIds, setSavedIds] = useState(SAVED_DEFAULT_IDS);
  const [watchedIds, setWatchedIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [showdownOpen, setShowdownOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [topics, setTopics] = useState([]);
  const [votes, setVotes] = useState({});
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
      } catch {
        /* ignore */
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    localStorage.setItem(
      `picks:${user.uid}`,
      JSON.stringify({ savedIds, watchedIds, quizXp, totalXp })
    );
  }, [user?.uid, savedIds, watchedIds, quizXp, totalXp]);

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

  const addRecommendation = ({ category: nextCategory, title, reason }) => {
    const next = {
      id: `mine-${Date.now()}`,
      type: "recommendation",
      category: nextCategory,
      author: user?.displayName || "You",
      handle: getInitials(user),
      rank: "Lvl 12 Curator",
      title,
      quote: reason,
      image:
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
  };

  const addShowdown = ({ question, left, right }) => {
    const next = {
      id: `showdown-${Date.now()}`,
      type: "showdown",
      category: "movies",
      author: user?.displayName?.split(" ")[0]?.toLowerCase() || "you",
      handle: getInitials(user),
      title: question,
      left: {
        id: "left",
        title: left,
        subtitle: "Your pick",
        image:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      },
      right: {
        id: "right",
        title: right,
        subtitle: "The challenger",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      },
      comments: 0,
      votes: 1,
      endsIn: "24h",
    };
    setFeed((current) => [next, ...current]);
    setTotalXp((xp) => xp + 10);
    setTab("home");
    setCategory("movies");
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
            onMarkWatched={(id) =>
              setWatchedIds((current) =>
                current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
              )
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
                onCreateShowdown={() => setShowdownOpen(true)}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                votes={votes}
                onVote={(id, choice) => setVotes((current) => ({ ...current, [id]: choice }))}
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
