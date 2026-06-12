"use client";

import { useState } from "react";
import { supabase, supabaseConfig } from "@/lib/supabaseClient";

// Auth is currently removed from the main flow and kept here for a later rebuild.
export default function ArchivedLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      setMessage(error?.message || "Account created. You can now log in.");
    } catch {
      setMessage("Unable to reach the authentication service.");
    }
  }

  async function handleLogin() {
    setMessage("");

    if (
      !supabaseConfig.hasUrl ||
      !supabaseConfig.hasAnonKey ||
      !supabaseConfig.isValidUrl
    ) {
      setMessage("The authentication service is not configured.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    } catch {
      setMessage("Unable to reach the authentication service.");
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="button" onClick={handleSignUp}>
        Sign Up
      </button>
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
