import { useState, useEffect, useCallback } from "react";
import { Shell } from "./components/Shell";
import { initApp } from "@freeappstore/sdk";
import { useAuth } from "@freeappstore/sdk/hooks";

const fas = initApp({ appId: "tennis-live" });

// ── Types ────────────────────────────────────────────────────────────────────

interface TennisMatch {
  id: string;
  name: string;
  tournament: string;
  country: string;
  status: string;
  home_team: string;
  away_team: string;
  home_score: string;
  away_score: string;
  home_sets?: string;
  away_sets?: string;
  time?: string;
  round?: string;
}

type Tab = "live" | "finished" | "upcoming";

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const isLive =
    s.includes("live") || s.includes("progress") || s.includes("set") || s === "inprogress";
  const isFinished =
    s.includes("finish") || s.includes("ended") || s === "ft" || s.includes("complete");

  if (isLive) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: "#dcfce7", color: "#15803d" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        LIVE
      </span>
    );
  }
  if (isFinished) {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: "var(--panel)", color: "var(--muted)" }}
      >
        FINISHED
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: "#eff6ff", color: "#1d4ed8" }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function MatchCard({ match }: { match: TennisMatch }) {
  const homeScore = parseInt(match.home_score ?? "0") || 0;
  const awayScore = parseInt(match.away_score ?? "0") || 0;
  const homeWinning = homeScore > awayScore;
  const awayWinning = awayScore > homeScore;
  const s = match.status.toLowerCase();
  const isFinished =
    s.includes("finish") || s.includes("ended") || s === "ft" || s.includes("complete");

  return (
    <div
      className="rounded-[1.25rem] p-4 border transition-shadow hover:shadow-md"
      style={{ background: "var(--panel)", borderColor: "var(--line)" }}
    >
      {/* Tournament + status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--accent)" }}>
            {match.tournament || "ATP/WTA Tour"}
          </p>
          {match.round && (
            <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
              {match.round}
            </p>
          )}
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Players + Score */}
      <div className="space-y-2">
        {/* Home player */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">🎾</span>
            <span
              className="font-semibold truncate text-sm"
              style={{
                color: homeWinning && isFinished ? "var(--success)" : "var(--ink)",
                fontWeight: homeWinning ? 700 : 500,
              }}
            >
              {match.home_team}
            </span>
            {homeWinning && isFinished && (
              <span className="text-xs font-bold" style={{ color: "var(--success)" }}>
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {match.home_sets && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--line)", color: "var(--muted)" }}>
                {match.home_sets}
              </span>
            )}
            <span
              className="text-xl font-bold tabular-nums w-8 text-right"
              style={{ color: homeWinning ? "var(--accent)" : "var(--ink)" }}
            >
              {match.home_score ?? "–"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "var(--line)" }} />

        {/* Away player */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">🎾</span>
            <span
              className="font-semibold truncate text-sm"
              style={{
                color: awayWinning && isFinished ? "var(--success)" : "var(--ink)",
                fontWeight: awayWinning ? 700 : 500,
              }}
            >
              {match.away_team}
            </span>
            {awayWinning && isFinished && (
              <span className="text-xs font-bold" style={{ color: "var(--success)" }}>
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {match.away_sets && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--line)", color: "var(--muted)" }}>
                {match.away_sets}
              </span>
            )}
            <span
              className="text-xl font-bold tabular-nums w-8 text-right"
              style={{ color: awayWinning ? "var(--accent)" : "var(--ink)" }}
            >
              {match.away_score ?? "–"}
            </span>
          </div>
        </div>
      </div>

      {/* Time */}
      {match.time && (
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          🕐 {match.time}
        </p>
      )}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {subtitle}
      </p>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { user, loading: authLoading } = useAuth(fas);
  const [tab, setTab] = useState<Tab>("live");
  const [matches, setMatches] = useState<TennisMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch live matches
      const liveRes = await fas.proxy.fetch("api.api-ninjas.com/v1/tennis?status=live");
      const liveData = liveRes.ok ? await liveRes.json() : [];

      // Fetch finished matches
      const finishedRes = await fas.proxy.fetch("api.api-ninjas.com/v1/tennis?status=finished");
      const finishedData = finishedRes.ok ? await finishedRes.json() : [];

      // Fetch upcoming matches
      const upcomingRes = await fas.proxy.fetch("api.api-ninjas.com/v1/tennis?status=upcoming");
      const upcomingData = upcomingRes.ok ? await upcomingRes.json() : [];

      const allMatches: TennisMatch[] = [
        ...(Array.isArray(liveData) ? liveData : []),
        ...(Array.isArray(finishedData) ? finishedData : []),
        ...(Array.isArray(upcomingData) ? upcomingData : []),
      ].map((m: Record<string, string>, i: number) => ({
        id: m.id ?? String(i),
        name: m.name ?? "",
        tournament: m.tournament ?? m.league ?? m.competition ?? "",
        country: m.country ?? "",
        status: m.status ?? "",
        home_team: m.home_team ?? m.player1 ?? "Player 1",
        away_team: m.away_team ?? m.player2 ?? "Player 2",
        home_score: m.home_score ?? m.score1 ?? "0",
        away_score: m.away_score ?? m.score2 ?? "0",
        home_sets: m.home_sets,
        away_sets: m.away_sets,
        time: m.time ?? m.date ?? m.datetime,
        round: m.round,
      }));

      setMatches(allMatches);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Failed to load matches. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    fetchMatches();
    const interval = setInterval(fetchMatches, 60_000);
    return () => clearInterval(interval);
  }, [fetchMatches, user]);

  // Filter matches by tab
  const filteredMatches = matches.filter((m) => {
    const s = m.status.toLowerCase();
    if (tab === "live") {
      return (
        s.includes("live") ||
        s.includes("progress") ||
        s.includes("set") ||
        s === "inprogress" ||
        s.includes("playing")
      );
    }
    if (tab === "finished") {
      return (
        s.includes("finish") ||
        s.includes("ended") ||
        s === "ft" ||
        s.includes("complete") ||
        s.includes("over")
      );
    }
    if (tab === "upcoming") {
      return (
        s.includes("upcoming") ||
        s.includes("scheduled") ||
        s.includes("not started") ||
        s === "ns" ||
        s.includes("postponed")
      );
    }
    return true;
  });

  // Tab config
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "live", label: "Live", icon: "🔴" },
    { id: "finished", label: "Finished", icon: "✅" },
    { id: "upcoming", label: "Upcoming", icon: "📅" },
  ];

  const tabNav = (
    <div className="flex gap-1 p-1 rounded-[1rem]" style={{ background: "var(--line)" }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[0.75rem] text-sm font-semibold transition-all"
          style={{
            background: tab === t.id ? "var(--paper)" : "transparent",
            color: tab === t.id ? "var(--ink)" : "var(--muted)",
            boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
          {t.id === "live" && matches.filter((m) => {
            const s = m.status.toLowerCase();
            return s.includes("live") || s.includes("progress") || s.includes("set");
          }).length > 0 && (
            <span
              className="text-xs rounded-full px-1.5 py-0.5 font-bold"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {matches.filter((m) => {
                const s = m.status.toLowerCase();
                return s.includes("live") || s.includes("progress") || s.includes("set");
              }).length}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const sidebarNav = (
    <div className="space-y-1 mt-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[0.75rem] text-sm font-semibold transition-all text-left"
          style={{
            background: tab === t.id ? "var(--accent)" : "transparent",
            color: tab === t.id ? "#fff" : "var(--muted)",
          }}
        >
          <span className="text-base">{t.icon}</span>
          <span>{t.label} Matches</span>
          {t.id === "live" && matches.filter((m) => {
            const s = m.status.toLowerCase();
            return s.includes("live") || s.includes("progress") || s.includes("set");
          }).length > 0 && (
            <span
              className="ml-auto text-xs rounded-full px-2 py-0.5 font-bold"
              style={{ background: tab === t.id ? "rgba(255,255,255,0.3)" : "#ef4444", color: "#fff" }}
            >
              {matches.filter((m) => {
                const s = m.status.toLowerCase();
                return s.includes("live") || s.includes("progress") || s.includes("set");
              }).length}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const bottomNav = (
    <>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="flex flex-col items-center gap-0.5 px-4 py-1"
          style={{ color: tab === t.id ? "var(--accent)" : "var(--muted)" }}
        >
          <span className="text-xl">{t.icon}</span>
          <span className="text-xs font-semibold">{t.label}</span>
        </button>
      ))}
    </>
  );

  return (
    <Shell nav={sidebarNav} bottomNav={bottomNav}>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
          >
            🎾 Tennis Live Scores
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()} · Auto-refreshes every 60s`
              : "Sign in to load live scores from around the world"}
          </p>
        </div>

        {/* Sign-in gate */}
        {!authLoading && !user && (
          <div
            className="rounded-[1.25rem] p-8 border text-center"
            style={{ background: "var(--panel)", borderColor: "var(--line)" }}
          >
            <div className="text-5xl mb-4">🎾</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
            >
              Sign in to watch the world play
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              Live scores, finished results, and upcoming matches — all in one place.
              Sign in with GitHub to get started (one tap, no key needed).
            </p>
            <button
              onClick={() => fas.auth.signIn()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[0.75rem] font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        )}

        {authLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-4xl animate-spin">🎾</div>
          </div>
        )}

        {user && (
          <>
            {/* Tabs (mobile + desktop inline) */}
            <div className="mb-6">{tabNav}</div>

            {/* Refresh button */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: "var(--ink)" }}>
                {tab === "live" && "🔴 Live Matches"}
                {tab === "finished" && "✅ Recently Finished"}
                {tab === "upcoming" && "📅 Upcoming Matches"}
                {filteredMatches.length > 0 && (
                  <span
                    className="ml-2 text-sm font-normal"
                    style={{ color: "var(--muted)" }}
                  >
                    ({filteredMatches.length})
                  </span>
                )}
              </h2>
              <button
                onClick={fetchMatches}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.75rem] text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--panel)", color: "var(--accent)", border: "1px solid var(--line)" }}
              >
                <span className={loading ? "animate-spin inline-block" : ""}>🔄</span>
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-[1rem] p-4 mb-4 text-sm font-medium"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && matches.length === 0 && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-[1.25rem] p-4 border animate-pulse"
                    style={{ background: "var(--panel)", borderColor: "var(--line)" }}
                  >
                    <div className="h-3 rounded mb-3 w-1/3" style={{ background: "var(--line)" }} />
                    <div className="h-4 rounded mb-2 w-2/3" style={{ background: "var(--line)" }} />
                    <div className="h-4 rounded w-1/2" style={{ background: "var(--line)" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Match cards */}
            {!loading && filteredMatches.length > 0 && (
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}

            {/* Empty states */}
            {!loading && filteredMatches.length === 0 && !error && matches.length > 0 && (
              <EmptyState
                icon={tab === "live" ? "😴" : tab === "finished" ? "🏆" : "📅"}
                title={
                  tab === "live"
                    ? "No live matches right now"
                    : tab === "finished"
                    ? "No recently finished matches"
                    : "No upcoming matches scheduled"
                }
                subtitle="Check back soon — the tennis world never sleeps for long!"
              />
            )}

            {!loading && matches.length === 0 && !error && (
              <EmptyState
                icon="🎾"
                title="No matches found"
                subtitle="Try refreshing — data may still be loading from the API."
              />
            )}
          </>
        )}
      </div>
    </Shell>
  );
}
