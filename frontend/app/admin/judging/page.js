"use client";

import { useMemo, useState } from "react";
import "./judging.css";

const API_BASE =
  globalThis.process?.env?.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/v1";

const ROUND_CONFIG = {
  MENTOR: {
    label: "Mentor round",
    eyebrow: "01 / evaluation pass",
    roundId: "mentor-round-1",
    evaluatorLabel: "mentors",
    accent: "cyan",
  },
  FINAL: {
    label: "Final round",
    eyebrow: "02 / championship pass",
    roundId: "final-round-1",
    evaluatorLabel: "judges",
    accent: "coral",
  },
};

const formatNumber = (value) =>
  typeof value === "number" ? value.toFixed(2) : "—";

const statusLabel = (error, loading, imported, calculated) => {
  if (loading) return "SYNCING";
  if (error) return "ACTION NEEDED";
  if (calculated) return "CALCULATED";
  if (imported) return "IMPORTED";
  return "AWAITING CSV";
};

export default function JudgingDashboard() {
  const [roundType, setRoundType] = useState("MENTOR");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [imported, setImported] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const round = ROUND_CONFIG[roundType];

  const request = async (path, options = {}) => {
    const accessToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null;
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body?.message || "The judging API could not complete that action.");
    }
    return body?.data ?? body;
  };

  const roundQuery = `roundId=${encodeURIComponent(round.roundId)}&roundType=${roundType}`;

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const body = new FormData();
      body.append("file", file);
      const data = await request(`/admin/judging/scores/preview?${roundQuery}`, {
        method: "POST",
        body,
      });
      setPreview(data);
      setNotice("CSV inspected. Review the validation grid before importing.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !preview?.readyToImport) return;
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      await request(`/admin/judging/scores/import?${roundQuery}`, {
        method: "POST",
        body,
      });
      setImported(true);
      setNotice(`${preview.validRows} score rows imported into ${round.label}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    try {
      await request(`/admin/judging/rounds/${round.roundId}/calculate?roundType=${roundType}`, {
        method: "POST",
      });
      setCalculated(true);
      setNotice(`${round.label} normalized scores have been calculated.`);
      await loadResults();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await request(
        `/admin/judging/rounds/${round.roundId}/results?roundType=${roundType}`,
      );
      setResults(data.results || []);
      setCalculated((data.results || []).length > 0);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return results;
    return results.filter((result) =>
      `${result.teamUnstopId} ${result.panelNumber}`.toLowerCase().includes(needle),
    );
  }, [query, results]);

  const resetRound = (nextRound) => {
    setRoundType(nextRound);
    setFile(null);
    setPreview(null);
    setResults([]);
    setImported(false);
    setCalculated(false);
    setError("");
    setNotice("");
  };

  return (
    <main className="judging-shell">
      <aside className="judging-sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">VX</span>
          <div>
            <p>VIIHAAN X</p>
            <span>operations console</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Admin sections">
          <span className="side-nav-label">Admin workspace</span>
          <a href="#overview">◈ <span>Overview</span></a>
          <a href="#teams">⌁ <span>Teams</span></a>
          <a className="active" href="#judging">◎ <span>Judging &amp; scores</span></a>
          <a href="#exports">↗ <span>Exports</span></a>
        </nav>

        <div className="sidebar-foot">
          <div className="connection-dot"><i /> API connection</div>
          <p>Super admin access only.<br />Score files stay private.</p>
        </div>
      </aside>

      <section className="judging-main" id="judging">
        <header className="topbar">
          <div>
            <p className="kicker">Vihaan X / internal control</p>
            <h1>Judging console</h1>
          </div>
          <div className="operator-chip">
            <span className="operator-avatar">SA</span>
            <span><b>SUPER ADMIN</b><small>score operations</small></span>
          </div>
        </header>

        <section className="hero-strip">
          <div>
            <p className="kicker">Normalization pipeline</p>
            <h2>Make every evaluator<br /><em>fairly comparable.</em></h2>
            <p className="hero-copy">Import the completed score sheets, inspect the data, then normalize each evaluator independently before ranking teams.</p>
          </div>
          <div className="equation-card" aria-label="Normalization formula">
            <span>SCORING MODEL / LIVE</span>
            <strong>(score − μ) / σ</strong>
            <small>team total = evaluator 01 + evaluator 02</small>
          </div>
        </section>

        <div className="round-switcher" role="tablist" aria-label="Judging round">
          {Object.entries(ROUND_CONFIG).map(([key, value]) => (
            <button
              key={key}
              className={roundType === key ? `selected ${value.accent}` : ""}
              onClick={() => resetRound(key)}
              role="tab"
              aria-selected={roundType === key}
            >
              <span>{value.eyebrow}</span>
              {value.label}
              <b>{key === "MENTOR" ? "2 evaluators / team" : "final judging"}</b>
            </button>
          ))}
        </div>

        <section className="status-grid" aria-label="Round status">
          <article><span className="status-icon cyan">↥</span><div><small>Current round</small><strong>{round.label}</strong></div></article>
          <article><span className="status-icon amber">#</span><div><small>Import status</small><strong>{imported ? "Scores loaded" : "Awaiting CSV"}</strong></div></article>
          <article><span className="status-icon coral">∑</span><div><small>Calculation</small><strong>{calculated ? "Results ready" : "Not calculated"}</strong></div></article>
          <article><span className="status-icon violet">↗</span><div><small>Access</small><strong>Super admin</strong></div></article>
        </section>

        <section className="work-grid">
          <article className="panel import-panel">
            <div className="panel-heading">
              <div><span className="step">01</span><div><p className="kicker">Input layer</p><h3>Import score sheet</h3></div></div>
              <span className="panel-status">CSV / required</span>
            </div>
            <p className="panel-intro">Upload one row per evaluator and team. Assignments are managed outside this console.</p>

            <label className={`drop-zone ${file ? "has-file" : ""}`}>
              <input type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] || null); setPreview(null); setImported(false); }} />
              <span className="upload-glyph">↥</span>
              <strong>{file ? file.name : "Drop the completed CSV here"}</strong>
              <small>{file ? `${(file.size / 1024).toFixed(1)} KB selected` : "or click to browse · max 2 MB"}</small>
            </label>

            <div className="file-actions">
              <button className="button secondary" disabled={!file || loading} onClick={handlePreview}>Inspect file <span>→</span></button>
              <button className="text-button" onClick={() => window.open("/judging-score-template.csv", "_blank")}>Download template ↗</button>
            </div>

            <div className="format-note">
              <span>EXPECTED COLUMNS</span>
              <code>round_type, panel_number, evaluator_number, team_id, total_score, stars</code>
            </div>
          </article>

          <article className="panel preview-panel">
            <div className="panel-heading">
              <div><span className="step">02</span><div><p className="kicker">Validation layer</p><h3>Preview &amp; confirm</h3></div></div>
              <span className={`panel-status ${preview?.readyToImport ? "good" : ""}`}>{preview ? (preview.readyToImport ? "READY TO IMPORT" : "FIX ERRORS") : "WAITING"}</span>
            </div>
            {preview ? (
              <>
                <div className="validation-metrics">
                  <div><strong>{preview.rowsRead}</strong><small>rows read</small></div>
                  <div><strong>{preview.validRows}</strong><small>valid rows</small></div>
                  <div className={preview.issues?.length ? "bad" : ""}><strong>{preview.issues?.length || 0}</strong><small>issues</small></div>
                </div>
                <div className="validation-list">
                  {preview.issues?.length ? preview.issues.slice(0, 4).map((issue, index) => (
                    <div className="validation-row bad" key={`${issue.line}-${index}`}><span>!</span><p>Line {issue.line || "—"}: {issue.message}</p></div>
                  )) : <div className="validation-row good"><span>✓</span><p>All rows are valid and teams have two evaluator scores.</p></div>}
                  {preview.incompleteTeams?.length ? <div className="validation-row bad"><span>!</span><p>{preview.incompleteTeams.length} team(s) do not have exactly two evaluator scores.</p></div> : null}
                </div>
                <button className="button primary" disabled={!preview.readyToImport || loading} onClick={handleImport}>Confirm import <span>→</span></button>
              </>
            ) : <div className="empty-state"><span>◌</span><strong>No file inspected</strong><p>Upload a score sheet to see validation results here.</p></div>}
          </article>
        </section>

        {(notice || error) && <div className={`callout ${error ? "error" : "notice"}`}><span>{error ? "!" : "✓"}</span>{error || notice}</div>}

        <section className="results-section" id="results">
          <div className="results-heading">
            <div><p className="kicker">Output layer / {roundType}</p><h2>Normalized results</h2></div>
            <div className="results-actions">
              <button className="button secondary" onClick={loadResults} disabled={loading}>Refresh results</button>
              <button className="button primary" onClick={handleCalculate} disabled={!imported || loading}>Calculate scores <span>↗</span></button>
            </div>
          </div>
          <div className="results-toolbar"><div className="result-count"><b>{results.length || "—"}</b> teams ranked</div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team ID or panel" /></label></div>
          <div className="table-wrap">
            {filteredResults.length ? <table><thead><tr><th>Rank</th><th>Team / panel</th><th>Evaluator 01</th><th>Evaluator 02</th><th>Combined score</th><th>Stars</th></tr></thead><tbody>{filteredResults.map((result) => <tr key={result.id}><td><span className={`rank rank-${result.rank}`}>{String(result.rank).padStart(2, "0")}</span></td><td><strong>{result.teamUnstopId}</strong><small>{result.panelNumber}</small></td><td>{formatNumber(result.evaluatorScores?.[0]?.normalizedScore)}<small>{result.evaluatorScores?.[0]?.evaluatorNumber}</small></td><td>{formatNumber(result.evaluatorScores?.[1]?.normalizedScore)}<small>{result.evaluatorScores?.[1]?.evaluatorNumber}</small></td><td><b className="score-value">{formatNumber(result.finalNormalizedScore)}</b></td><td><span className="star-value">★ {result.totalStars}</span></td></tr>)}</tbody></table> : <div className="empty-results"><div className="radar-orbit">◎</div><h3>{calculated ? "No matching teams" : "Results are waiting"}</h3><p>{calculated ? "Try a different search term." : "Import and calculate a round to populate the ranking table."}</p></div>}
          </div>
        </section>

        <footer className="judging-footer"><span>VX / SCORE OPERATIONS</span><span>Participant-facing judgement data is never exposed.</span><span>{statusLabel(error, loading, imported, calculated)}</span></footer>
      </section>
    </main>
  );
}
