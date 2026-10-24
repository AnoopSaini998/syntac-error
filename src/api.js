import { db, auth } from "./firebase";
import {
  collection, addDoc, getDocs, doc, updateDoc,
  increment, query, orderBy, serverTimestamp
} from "firebase/firestore";

// 1. Fetch posts for the Home feed
export async function getPosts() {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

// 2. Create a new post from the Post screen
export async function createPost(category, title, caption, imageUrl) {
  if (!auth.currentUser) throw new Error("You must be logged in to post.");
  
  const displayName = auth.currentUser.displayName || "Anonymous";
  const email = auth.currentUser.email || "";
  const handle = displayName !== "Anonymous"
    ? displayName.slice(0, 2).toUpperCase()
    : (email ? email.slice(0, 2).toUpperCase() : "YO");

  await addDoc(collection(db, "posts"), {
    type: "recommendation",
    category,
    title,
    caption,
    quote: caption,
    imageUrl: imageUrl || "",
    image: imageUrl || "",
    authorId: auth.currentUser.uid,
    authorName: displayName,
    author: displayName,
    handle,
    rank: "Lvl 1 Curator",
    recommendedBy: email ? `@${email.split("@")[0]}` : "@you",
    upvotes: 0,
    comments: 0,
    createdAt: serverTimestamp(),
  });
}

// 3. Upvote a post
export async function upvotePost(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { upvotes: increment(1) });
  } catch (error) {
    console.error("Error upvoting post: ", error);
  }
}

// 4. Fetch Leaderboard data for the Champions screen
export async function getLeaderboard() {
  try {
    const snap = await getDocs(collection(db, "leaderboard"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    return [];
  }
}