import { useState } from "react";

export default function LoginScreen({
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
  onResetPassword,
  error,
}) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setInfo("");
    try {
      if (mode === "signup") {
        await onEmailSignUp(email, password, name);
      } else {
        await onEmailSignIn(email, password);
      }
    } catch (err) {
      // parent surfaces error
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setInfo("Enter your email first, then tap reset.");
      return;
    }
    setBusy(true);
    try {
      await onResetPassword(email);
      setInfo("Password reset email sent.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <div className="login-mark">✦</div>
      <p className="eyebrow">Community picks</p>
      <h1>Find your next favorite</h1>
      <p className="login-copy">
        Discover cafes, movies, songs, and hidden gems from people whose taste
        you actually trust.
      </p>
      <button className="btn-primary login-btn" onClick={onGoogleSignIn} type="button">
        Continue with Google
      </button>

      <div className="or-line">or email</div>

      <form className="auth-form" onSubmit={submit}>
        {mode === "signup" ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Display name"
            autoComplete="name"
          />
        ) : null}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={6}
        />
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      {error ? <p className="auth-error">{error}</p> : null}
      {info ? <p className="login-hint">{info}</p> : null}

      <div className="auth-switch">
        {mode === "signin" ? (
          <>
            <button type="button" className="text-link" onClick={handleReset}>
              Forgot password?
            </button>
            <button type="button" className="text-link" onClick={() => setMode("signup")}>
              Create an account
            </button>
          </>
        ) : (
          <button type="button" className="text-link" onClick={() => setMode("signin")}>
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
