"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_GATEWAY_URL } from "@/lib/api";

type Mode = "login" | "register";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

const STORAGE_KEY = "tripsync-auth";

function readStoredAuth(): { token: string; user: AuthUser } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.token && parsed?.user ? parsed : null;
  } catch {
    return null;
  }
}

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<{ token: string; user: AuthUser } | null>(readStoredAuth);

  useEffect(() => {
    if (!open) return;
    setError("");
    setSession(readStoredAuth());
  }, [open]);

  const heading = useMemo(() => (mode === "login" ? "Welcome back" : "Create your account"), [mode]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };
      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Authentication failed");
      }

      const nextSession = {
        token: data.accessToken,
        user: data.user,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setName("");
      setEmail("");
      setPassword("");
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">TripSync</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{heading}</h2>
            <p className="mt-2 text-sm text-slate-500">Secure access to your planner, bookings, and saved ideas.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500">Close</button>
        </div>

        {session ? (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Signed in as {session.user.name}</p>
            <p className="mt-1 text-emerald-700">{session.user.email}</p>
            <button onClick={handleLogout} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white">Sign out</button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Ada Lovelace" />
              </label>
            ) : null}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="you@example.com" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="At least 8 characters" />
            </label>

            {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-medium text-emerald-600">
            {mode === "login" ? "Create an account" : "Already have an account?"}
          </button>
          <button onClick={onClose} className="font-medium text-slate-500">Skip for now</button>
        </div>
      </div>
    </div>
  );
}
