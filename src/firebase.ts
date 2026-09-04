/**
 * Supabase-backed authentication, behind a Firebase-shaped facade.
 *
 * The module name and its exports are unchanged on purpose. App.tsx imports
 * seventeen symbols from here and is 10,255 lines long; AuthModal.tsx and
 * utils/api.ts import more. Keeping the surface identical meant the migration
 * from the old hand-written mock to real Supabase Auth touched this file only.
 *
 * What changed underneath:
 *
 *   Sessions are real. Supabase issues the JWT, refreshes it before expiry and
 *   revokes it on sign-out; the server verifies it with the project's secret.
 *   getIdToken() hands back the live access token rather than a fixed string.
 *
 *   The localStorage sandbox is gone. It seeded three accounts — including
 *   admin@cityhealer.com / password123 — into every visitor's browser and signed
 *   people in against them whenever the API was unreachable. On a frontend-only
 *   deployment that was the entire authentication system. An outage now surfaces
 *   as an error instead of silently handing out an admin session.
 *
 * Errors keep their Firebase-style `auth/...` codes because the UI switches on
 * eighteen of them; mapErr() below is the single place that translation happens.
 */
import { createClient, type AuthError, type User } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isAuthConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isAuthConfigured) {
  console.error(
    "[Auth] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. Sign-in is " +
    "disabled; the public pages still work. Copy both from Supabase → Project " +
    "Settings → API into .env.local and restart Vite."
  );
}

/**
 * A stand-in used only when the project is not configured.
 *
 * createClient() throws "supabaseUrl is required" on an empty string, and this
 * module is imported at the top of App.tsx — so constructing it unconditionally
 * took down the whole React tree and rendered a blank page, turning a missing
 * environment variable into what looks like a broken build. Hospitals, doctors
 * and the medicine catalogue are public routes that need no session at all, so
 * the app is expected to render and browse fine while signed out.
 *
 * Every call resolves the way a signed-out client would, and the ones that
 * cannot be faked return a stated error rather than a confusing null.
 */
function unconfiguredClient() {
  const notConfigured = {
    message: "Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    status: 503,
    code: "signup_disabled"
  } as any;

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() { /* nothing to detach */ } } }
      }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: notConfigured }),
      signUp: async () => ({ data: { user: null, session: null }, error: notConfigured }),
      signInWithOAuth: async () => ({ data: null, error: notConfigured }),
      signOut: async () => ({ error: null }),
      resend: async () => ({ data: null, error: notConfigured }),
      resetPasswordForEmail: async () => ({ data: null, error: notConfigured })
    }
  } as any;
}

export const supabase = isAuthConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true // completes the OAuth redirect handshake
      }
    })
  : unconfiguredClient();

/** The user shape the app already renders against. */
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: any[];
  getIdToken: () => Promise<string>;
}

function toMockUser(user: User | null): MockUser | null {
  if (!user) return null;
  const meta = (user.user_metadata ?? {}) as Record<string, any>;
  return {
    uid: user.id,
    email: user.email ?? "",
    displayName: meta.name || meta.full_name || user.email?.split("@")[0] || "",
    phoneNumber: meta.phone || user.phone || "",
    // Truthful now, where the mock hardcoded true. A session only exists for a
    // confirmed account, and Supabase stamps this immediately when email
    // confirmation is switched off — so this stays true in both configurations.
    emailVerified: !!user.email_confirmed_at,
    isAnonymous: false,
    tenantId: null,
    providerData: user.app_metadata?.providers ?? [],
    // Always read through getSession(): it returns the refreshed token rather
    // than whatever was current when this object was built.
    getIdToken: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? "";
    }
  };
}

/**
 * Translate a Supabase error into the `auth/...` code the UI switches on.
 *
 * Matches on the stable `code` field first and falls back to message text,
 * because older releases of supabase-js only populate the message.
 */
function mapErr(error: AuthError | null, fallback = "auth/operation-not-allowed") {
  if (!error) return null;
  const code = (error as any).code ?? "";
  const msg = (error.message ?? "").toLowerCase();
  const status = error.status ?? 0;

  const pick = () => {
    if (code === "invalid_credentials" || msg.includes("invalid login credentials")) return "auth/invalid-credential";
    if (code === "user_already_exists" || msg.includes("already registered") || msg.includes("already been registered")) return "auth/email-already-in-use";
    if (code === "weak_password" || msg.includes("password should be") || msg.includes("password is too weak")) return "auth/weak-password";
    if (code === "email_not_confirmed" || msg.includes("not confirmed")) return "auth/unverified-email";
    if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || status === 429) return "auth/too-many-requests";
    if (code === "validation_failed" || msg.includes("invalid email") || msg.includes("unable to validate email")) return "auth/invalid-email";
    if (code === "signup_disabled" || msg.includes("signups not allowed")) return "auth/operation-not-allowed";
    if (code === "user_not_found" || msg.includes("user not found")) return "auth/user-not-found";
    if (msg.includes("redirect") || msg.includes("provider is not enabled")) return "auth/unauthorized-domain";
    if (msg.includes("fetch") || msg.includes("network")) return "auth/network-request-failed";
    return fallback;
  };

  return { code: pick(), message: error.message };
}

function throwMapped(error: AuthError | null, fallback?: string): void {
  const mapped = mapErr(error, fallback);
  if (mapped) throw mapped;
}

// ---------------------------------------------------------------------------
// auth object
// ---------------------------------------------------------------------------

class SupabaseAuth {
  currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  constructor() {
    // Restore whatever session is already in storage, then track every change.
    supabase.auth.getSession().then(({ data }) => {
      this.currentUser = toMockUser(data.session?.user ?? null);
      this.notify();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser = toMockUser(session?.user ?? null);
      this.notify();
    });
  }

  subscribe(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser); // fire immediately with current state
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }
}

export const auth = new SupabaseAuth();

/** Firestore handle placeholder. Profile reads go through the API, below. */
export const db = {};

export const browserLocalPersistence = "LOCAL";
export const browserSessionPersistence = "SESSION";

/**
 * Persistence is fixed at client construction in supabase-js, so this cannot
 * switch storage after the fact. Sessions persist across tabs and restarts;
 * a "remember me = off" choice is honoured by signing out, not by storage.
 */
export async function setPersistence(_authInst: any, _persistenceType: any) {
  return Promise.resolve();
}

// ---------------------------------------------------------------------------
// Credential flows
// ---------------------------------------------------------------------------

export async function signInWithEmailAndPassword(_authInst: any, email: string, pass: string) {
  if (!email) throw { code: "auth/invalid-email", message: "Enter your email address." };
  if (!pass) throw { code: "auth/missing-passcode", message: "Enter your passcode." };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: pass
  });
  throwMapped(error, "auth/invalid-credential");

  const user = toMockUser(data.user);
  auth.currentUser = user;
  auth.notify();
  return { user };
}

export async function createUserWithEmailAndPassword(_authInst: any, email: string, pass: string) {
  if (!email) throw { code: "auth/invalid-email", message: "Enter your email address." };
  if (!pass) throw { code: "auth/missing-passcode", message: "Choose a passcode." };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: pass
  });
  throwMapped(error, "auth/email-already-in-use");

  // The public.users profile row is created by the on_auth_user_created trigger
  // in the same transaction as the account, so there is nothing to insert here.
  // The trigger also fixes the role at PATIENT and ignores client metadata,
  // which is what makes a self-assigned ADMIN impossible.
  const user = toMockUser(data.user);
  auth.currentUser = user;
  auth.notify();
  return { user };
}

export async function signOut(_authInst: any) {
  const { error } = await supabase.auth.signOut();
  auth.currentUser = null;
  auth.notify();
  // Clear the previous implementation's keys so a browser carrying an old
  // session does not keep presenting a token this server will never accept.
  try {
    localStorage.removeItem("city_healer_jwt");
    localStorage.removeItem("city_healer_user");
    localStorage.removeItem("city_healer_mock_users");
  } catch { /* storage unavailable */ }
  throwMapped(error);
}

export function onAuthStateChanged(_authInst: any, callback: (user: MockUser | null) => void) {
  return auth.subscribe(callback);
}

export async function sendEmailVerification(_user: any) {
  const email = auth.currentUser?.email;
  if (!email) throw { code: "auth/user-not-found", message: "No signed-in account to verify." };
  const { error } = await supabase.auth.resend({ type: "signup", email });
  throwMapped(error);
}

export async function sendPasswordResetEmail(_authInst: any, email: string) {
  if (!email) throw { code: "auth/invalid-email", message: "Enter your email address." };
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/reset-password`
  });
  throwMapped(error);
}

// ---------------------------------------------------------------------------
// OAuth
// ---------------------------------------------------------------------------

export class GoogleAuthProvider {
  static PROVIDER_ID = "google.com";
  providerId = "google.com";
  addScope(_scope: string) { return this; }
  setCustomParameters(_params: any) { return this; }
}

/**
 * Supabase OAuth is a full-page redirect, not a popup — the browser leaves and
 * comes back with the session in the URL, which detectSessionInUrl completes.
 * signInWithPopup therefore resolves without a user; the session arrives through
 * onAuthStateChanged after the round trip.
 */
export async function signInWithPopup(
  _authInst: any,
  _provider: any,
  // The mock took a caller-supplied identity hint to seed its local account.
  // Google is the source of identity here, so this is accepted for call-site
  // compatibility and deliberately ignored — trusting a client-supplied name or
  // role at sign-in is exactly what the removed sandbox got wrong.
  _identity?: { email?: string; name?: string; role?: string }
) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });
  throwMapped(error, "auth/google-sign-in-failed");
  return { user: null };
}

export async function signInWithRedirect(_authInst: any, _provider: any) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });
  throwMapped(error, "auth/google-sign-in-failed");
}

// ---------------------------------------------------------------------------
// Profile documents — served by the Express API, not PostgREST
// ---------------------------------------------------------------------------
// The API owns the role and ownership rules for profiles, so these keep going
// through /api/users/:uid rather than querying Postgres directly.

export interface MockDocRef {
  collection: string;
  id: string;
}

export function doc(_dbInst: any, collectionName: string, id: string): MockDocRef {
  return { collection: collectionName, id };
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getDoc(docRef: MockDocRef) {
  const res = await fetch(`/api/users/${docRef.id}`, { headers: await authHeaders() });

  // Preserved: callers distinguish "no profile yet" from "request failed" by
  // catching this, and create the profile in response.
  if (res.status === 404) throw { is404: true };

  if (!res.ok) {
    return { exists: () => false, data: () => null };
  }
  const data = await res.json();
  return { exists: () => true, data: () => data };
}

export const getDocFromServer = getDoc;

export async function setDoc(docRef: MockDocRef, data: any) {
  const res = await fetch(`/api/users/${docRef.id}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw {
      code: res.status === 403 ? "auth/operation-not-allowed" : "auth/network-request-failed",
      message: detail.error || "Could not save the profile."
    };
  }
  return res.json();
}

export function serverTimestamp() {
  return new Date().toISOString();
}
