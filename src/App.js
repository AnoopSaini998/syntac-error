import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { DEBATE_XP_REQUIRED, getDebateNoun, INITIAL_FEED, SAVED_DEFAULT_IDS, TOPIC_CATEGORIES } from "./data";
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
  const [feed, setFeed] = useState(() => {
    try {
      const stored = localStorage.getItem("picks:feed");
      return stored ? JSON.parse(stored) : INITIAL_FEED;
    } catch {
      return INITIAL_FEED;
    }
  });
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
  const [streak, setStreak] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [quizzes, setQuizzes] = useState(() => {
    try {
      const stored = localStorage.getItem("picks:quizzes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const stored = localStorage.getItem("picks:leaderboard");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

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
    try {
      const RESET_KEY = "picks:coins_zeroed_v5";
      if (!localStorage.getItem(RESET_KEY)) {
        setTotalXp(0);
        setQuizXp(0);
        setStreak(0);
        localStorage.setItem(RESET_KEY, "true");
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("picks:")) {
            try {
              const val = JSON.parse(localStorage.getItem(k));
              if (val && typeof val === "object") {
                if (typeof val.totalXp === "number" || typeof val.quizXp === "number") {
                  val.totalXp = 0;
                  val.quizXp = 0;
                  val.streak = 0;
                  localStorage.setItem(k, JSON.stringify(val));
                }
              }
            } catch {
              /* ignore */
            }
          }
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const raw = localStorage.getItem(`picks:${user.uid}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.savedIds) setSavedIds(parsed.savedIds);
        if (parsed.watchedIds) setWatchedIds(parsed.watchedIds);
        const qXp = (parsed.quizXp === 120 || !parsed.quizXp) ? 0 : parsed.quizXp;
        const tXp = (parsed.totalXp === 4820 || !parsed.totalXp) ? 0 : parsed.totalXp;
        setQuizXp(qXp);
        setTotalXp(tXp);
        setStreak(parsed.streak || 0);
        if (parsed.votedIds) setVotedIds(parsed.votedIds);
        if (parsed.votes) setVotes(parsed.votes);
        if (parsed.notesRead) setNotesRead(true);
      } catch {
        /* ignore */
      }
    } else {
      setSavedIds([]);
      setWatchedIds([]);
      setQuizXp(0);
      setTotalXp(0);
      setStreak(0);
      setVotedIds([]);
      setVotes({});
      setNotesRead(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    localStorage.setItem(
      `picks:${user.uid}`,
      JSON.stringify({ savedIds, watchedIds, quizXp, totalXp, streak, votedIds, votes, notesRead })
    );
  }, [user?.uid, savedIds, watchedIds, quizXp, totalXp, streak, votedIds, votes, notesRead]);

  useEffect(() => {
    try {
      localStorage.setItem("picks:feed", JSON.stringify(feed));
    } catch {
      /* ignore */
    }
  }, [feed]);

  useEffect(() => {
    try {
      localStorage.setItem("picks:quizzes", JSON.stringify(quizzes));
    } catch {
      /* ignore */
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem("picks:leaderboard", JSON.stringify(leaderboard));
    } catch {
      /* ignore */
    }
  }, [leaderboard]);

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

  const toggleUpvote = (id) => {
    const isVoted = votedIds.includes(id);
    setVotedIds((current) =>
      isVoted ? current.filter((item) => item !== id) : [...current, id]
    );
    setFeed((currentFeed) =>
      currentFeed.map((item) => {
        if (item.id === id) {
          const delta = isVoted ? -1 : 1;
          return { ...item, upvotes: Math.max(0, (item.upvotes || 0) + delta) };
        }
        return item;
      })
    );
  };

  const handleVoteShowdown = (id, choice) => {
    const prevChoice = votes[id];
    if (prevChoice === choice) return;
    setVotes((current) => ({ ...current, [id]: choice }));
    setFeed((current) =>
      current.map((item) => {
        if (item.id === id && item.type === "showdown") {
          let leftVotes = item.left.votes || 0;
          let rightVotes = item.right.votes || 0;
          if (prevChoice === item.left.id) leftVotes = Math.max(0, leftVotes - 1);
          if (prevChoice === item.right.id) rightVotes = Math.max(0, rightVotes - 1);
          if (choice === item.left.id) leftVotes += 1;
          if (choice === item.right.id) rightVotes += 1;
          return {
            ...item,
            left: { ...item.left, votes: leftVotes },
            right: { ...item.right, votes: rightVotes },
            votes: leftVotes + rightVotes,
          };
        }
        return item;
      })
    );
  };

  const markWatched = (id, liked) => {
    setWatchedIds((current) => (current.includes(id) ? current : [...current, id]));
    if (liked) toggleUpvote(id);
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
    const ownEmail = user?.email;
    const ownHandle = ownEmail ? `@${ownEmail.split("@")[0]}` : null;
    return feed.filter(
      (item) =>
        item.type === "recommendation" &&
        (item.mine ||
          (item.authorId && item.authorId === user?.uid) ||
          (ownName && item.author === ownName) ||
          (ownHandle && item.recommendedBy === ownHandle))
    );
  }, [feed, user]);

  const deletePost = (id) => {
    setFeed((current) => current.filter((item) => item.id !== id));
    setSavedIds((current) => current.filter((savedId) => savedId !== id));
    setVotedIds((current) => current.filter((votedId) => votedId !== id));
  };

  const addRecommendation = ({ category: nextCategory, title, reason, image }) => {
    const next = {
      id: `mine-${Date.now()}`,
      type: "recommendation",
      category: nextCategory,
      author: user?.displayName || user?.email?.split("@")[0] || "You",
      handle: getInitials(user),
      rank: "Lvl 1 Scout",
      title,
      quote: reason,
      image: image || null,
      upvotes: 0,
      comments: 0,
      recommendedBy: user?.email ? `@${user.email.split("@")[0]}` : "@you",
      mine: true,
      authorId: user?.uid,
    };
    setFeed((current) => [next, ...current]);
    setTotalXp((xp) => xp + 15);
    setTab("home");
    setCategory("all");
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
      author: user?.displayName?.split(" ")[0]?.toLowerCase() || user?.email?.split("@")[0] || "you",
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
      mine: true,
      authorId: user?.uid,
    };
    setFeed((current) => [next, ...current]);
    setTotalXp((xp) => xp + 10);
    setTab("home");
    if (nextCategory !== "all") setCategory(nextCategory);
  };

  const handleAddQuiz = (quizData) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      author: user?.displayName || user?.email?.split("@")[0] || "You",
      ...quizData,
    };
    setQuizzes((current) => [newQuiz, ...current]);
    setTotalXp((xp) => xp + 10);
  };

  const handleCompleteQuiz = (earnedXp, isCorrect) => {
    const nextQuizXp = quizXp + earnedXp;
    const nextTotalXp = totalXp + earnedXp;
    const nextStreak = isCorrect ? streak + 1 : streak;
    setQuizXp(nextQuizXp);
    setTotalXp(nextTotalXp);
    if (isCorrect) setStreak(nextStreak);

    if (user) {
      setLeaderboard((current) => {
        const filtered = current.filter((p) => p.uid !== user.uid);
        const userEntry = {
          id: user.uid,
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "You",
          handle: getInitials(user),
          xp: nextQuizXp,
          streak: nextStreak,
          days: `${nextStreak} day${nextStreak === 1 ? "" : "s"}`,
        };
        return [...filtered, userEntry].sort((a, b) => b.xp - a.xp);
      });
    }
  };

  const phone = (content) => (
    <div className="stage">
      <div className="phone">
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
                onCreateShowdown={() => setShowdownOpen(true)}
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
                onVote={handleVoteShowdown}
                onDeletePost={deletePost}
                totalXp={totalXp}
              />
            )}
            {tab === "champions" && (
              <ChampionsScreen
                user={user}
                quizXp={quizXp}
                streak={streak}
                leaderboard={leaderboard}
              />
            )}
            {tab === "quizzes" && (
              <QuizzesScreen
                user={user}
                quizXp={quizXp}
                streak={streak}
                quizzes={quizzes}
                onOpenLeaderboard={() => setTab("champions")}
                onCompleteQuiz={handleCompleteQuiz}
                onCreateQuiz={handleAddQuiz}
                leaderboard={leaderboard}
              />
            )}
            {tab === "profile" && (
              <ProfileScreen
                user={user}
                totalXp={totalXp}
                streak={streak}
                picks={myPicks}
                savedCount={savedIds.length}
                onOpenSaved={() => setShowSaved(true)}
                onSignOut={handleSignOut}
                onDeletePost={deletePost}
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
