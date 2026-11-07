'use client';
/* global process */

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import './volunteer.css';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export default function VolunteerDashboard() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [rsvp, setRsvp] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recovering, setRecovering] = useState(false);
  const [view, setView] = useState(null);
  const [unlinked, setUnlinked] = useState(false);
  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [replacement, setReplacement] = useState('');
  const [reason, setReason] = useState('');
  const [room, setRoom] = useState('');
  const [roomReason, setRoomReason] = useState('');
  const [inventory, setInventory] = useState('');
  const video = useRef(null);
  const scanner = useRef(null);
  const access = auth?.accessToken;

  async function api(path, options = {}, token = access) {
    const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) { const err = new Error(payload.message || 'Request failed'); err.code = payload.code; throw err; }
    return payload.data;
  }
  const post = (body) => ({ method: 'POST', body: JSON.stringify(body) });
  async function run(action) { setBusy(true); setError(''); setMessage(''); try { await action(); } catch (e) { setError(e.message || 'Something went wrong'); } finally { setBusy(false); } }
  useEffect(() => { api('/schedule', {}, null).then(data => setMeals(data.meals)).catch(() => setError('Could not load the meal schedule. Check the API connection.')); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { scanner.current?.destroy(); }, []);
  function stopCamera() { scanner.current?.destroy(); scanner.current = null; setScanning(false); }
  async function scan() {
    try {
      if (!video.current) return;
      scanner.current = new QrScanner(video.current, result => {
        const value = result.data.trim();
        setCode(value);
        stopCamera();
        lookup(value);
      }, { preferredCamera: 'environment', returnDetailedScanResult: true });
      setScanning(true);
      await scanner.current.start();
    } catch { stopCamera(); setError('Unable to access the camera. Check permission or enter the card number.'); }
  }
  async function login(e) { e.preventDefault(); await run(async () => { const result = await api('/auth/admin/login', post({ username, password }), null); setAuth(result); setPassword(''); }); }
  async function lookup(value = code) { await run(async () => { setView(null); setUnlinked(false); setRecovering(false); setRsvp(''); try { setView(await api('/desk/lookup', post({ code: value.trim() }))); } catch (e) { if (e.code === 'CARD_NOT_LINKED') setUnlinked(true); else throw e; } }); }
  async function link(e) { e.preventDefault(); await run(async () => { const result = await api('/desk/link', post({ code: code.trim(), rsvpCode: rsvp.trim() })); setView(result); setUnlinked(false); setRsvp(''); setMessage(result.allocationStatus === 'ALLOCATED' ? 'Card linked and team allocated.' : `Card linked. Allocation needs attention: ${result.allocationStatus.replaceAll('_', ' ').toLowerCase()}.`); }); }
  async function meal(id, undo = false) { await run(async () => { const result = await api(`/participants/${view.participant.id}/meals/${id}`, { method: undo ? 'DELETE' : 'POST' }); setView(result); setMessage(undo ? 'Meal record removed.' : 'Meal recorded.'); }); }
  async function retry() { await run(async () => { const result = await api('/desk/retry-allocation', post({ code: code.trim() })); setView(result); setMessage(result.allocationStatus === 'ALLOCATED' ? 'Team allocated.' : 'No suitable allocation is available yet.'); }); }
  async function findForReplacement(e) { e.preventDefault(); await run(async () => { setView(await api('/desk/participant-by-code', post({ rsvpCode: recoveryCode.trim() }))); setRecovering(true); setUnlinked(false); setMessage('Verify the participant before replacing the lost card.'); }); }
  async function replace(e) { e.preventDefault(); await run(async () => { const result = await api('/desk/replace', post({ participantId: view.participant.id, code: replacement.trim(), reason: reason.trim() })); setCode(replacement.trim()); setView(result); setRecovering(false); setRecoveryCode(''); setReplacement(''); setReason(''); setMessage('Card replaced. The previous card is revoked.'); }); }
  async function move(e) { e.preventDefault(); await run(async () => { await api('/desk/move', post({ teamId: view.team.id, room: room.trim(), reason: roomReason.trim() })); setView(await api('/desk/lookup', post({ code: code.trim() }))); setRoom(''); setRoomReason(''); setMessage('Team moved successfully.'); }); }
  async function editPerson(e) { e.preventDefault(); const form = new FormData(e.currentTarget); await run(async () => { await api(`/admin/participants/${view.participant.id}`, { method: 'PATCH', body: JSON.stringify({ name: form.get('name'), email: form.get('email'), college: form.get('college') }) }); setView(await api('/desk/lookup', post({ code: code.trim() }))); setMessage('Participant details updated.'); }); }
  async function saveInventory(e) { e.preventDefault(); await run(async () => { let data; try { data = JSON.parse(inventory); } catch { throw new Error('Enter valid room inventory JSON.'); } await api('/rooms/inventory', { method: 'PUT', body: JSON.stringify(data) }); setMessage(`Room ${data.number} saved.`); }); }
  async function logout() { try { await api('/auth/logout', { method: 'POST' }); } catch { /* Clear the local session even if the API is unavailable. */ } stopCamera(); setAuth(null); setView(null); setCode(''); setUnlinked(false); }
  const admin = auth?.admin?.role === 'SUPER_ADMIN';

  return <main className="desk-shell"><div className="desk-glow"/><header className="desk-header"><a href="/" className="desk-logo">VIHAAN<span>X</span><small> / OPERATIONS</small></a>{auth && <div className="desk-user"><span>{auth.admin.username} <b>{admin ? 'ADMIN' : 'VOLUNTEER'}</b></span><button className="text-button" onClick={logout}>Sign out ↗</button></div>}</header>
    {!auth ? <section className="desk-login"><div className="eyebrow">EVENT OPERATIONS · 2026</div><h1>Good to have<br/>you <em>on the team.</em></h1><p>Sign in to manage check-ins and meals at Vihaan X.</p><form onSubmit={login} className="desk-panel login-panel"><label>Username<input autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username" /></label><label>Password<input autoComplete="current-password" required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" /></label><button className="primary" disabled={busy}>Sign in <span>→</span></button>{error && <p className="alert error" role="alert">{error}</p>}</form><p className="footnote">ACCESS FOR AUTHORIZED EVENT STAFF</p></section> : <div className="desk-content"><div className="heading"><div><div className="eyebrow"><span className="live-dot"/> EVENT DESK / LIVE OPERATIONS</div><h1>Volunteer dashboard<span>.</span></h1><p>Scan a participant’s card to get started.</p></div><div className="event-pill">VIHAAN X <span>14—15 NOV 2026</span></div></div>
    <div className="desk-grid"><section className="desk-panel scan-panel"><div className="panel-heading"><div><div className="section-index">01 / IDENTIFY</div><h2>Scan a card</h2></div><span className="panel-icon">⌗</span></div><p>Scan the QR on the participant’s ID card, or enter its number manually.</p><div className={`camera ${scanning ? 'active' : ''}`}><video ref={video} muted playsInline aria-label="QR scanner camera"/>{!scanning && <div className="camera-placeholder"><div className="scan-mark">⌗</div><strong>Ready to scan</strong><span>Use your device camera</span></div>}</div><button className="secondary full" onClick={scanning ? stopCamera : scan} disabled={busy}>{scanning ? 'Stop camera' : '◎  Open camera'}</button><div className="divider"><span>OR ENTER MANUALLY</span></div><form onSubmit={e => { e.preventDefault(); lookup(); }}><label>Card number<div className="input-action"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter card number" autoComplete="off" required/><button className="primary" disabled={busy}>Look up →</button></div></label></form>
    {unlinked && <form className="link-form" onSubmit={link}><div className="status-tag amber">UNLINKED CARD</div><h3>Link to a participant</h3><p>Enter the unique check-in code from their invitation email.</p><label>Check-in code<input value={rsvp} onChange={e => setRsvp(e.target.value.toUpperCase())} placeholder="Enter RSVP code" required autoComplete="off"/></label><button className="primary full" disabled={busy}>Link & check in →</button></form>}
    <details className="details-action"><summary>Find participant for lost card <span>＋</span></summary><form onSubmit={findForReplacement}><p>Use the participant’s check-in code and verify their identity before issuing a replacement.</p><label>Check-in code<input value={recoveryCode} onChange={e => setRecoveryCode(e.target.value.toUpperCase())} required /></label><button className="secondary" disabled={busy}>Find participant</button></form></details>
    {error && <p className="alert error" role="alert">{error}</p>}{message && <p className="alert success" role="status">{message}</p>}</section>
    <section className="desk-panel participant-panel"><div className="panel-heading"><div><div className="section-index">02 / PARTICIPANT</div><h2>Participant details</h2></div><span className="panel-icon">↗</span></div>{!view ? <div className="empty"><div className="empty-icon">✳</div><strong>No card selected</strong><span>Participant details and meal status will appear here after a scan.</span></div> : <><div className="person"><div className="avatar">{view.participant.name?.[0]?.toUpperCase()}</div><div><h3>{view.participant.name}</h3><p>{view.participant.role === 'LEADER' ? 'Team leader' : 'Team member'} · {view.team.name}</p></div><span className="status-tag green">{view.participant.checkedIn ? 'CHECKED IN' : 'NOT CHECKED IN'}</span></div><div className="assignment"><div><span>TEAM</span><strong>{view.team.name}</strong></div><div><span>ROOM</span><strong>{view.team.room || 'Unassigned'}</strong></div><div><span>TABLE{view.team.tables?.length === 1 ? '' : 'S'}</span><strong>{view.team.tables?.join(', ') || '—'}</strong></div></div>{!view.team.room && !recovering && <div className="allocation-warning">No suitable room is assigned yet. <button className="text-button" onClick={retry} disabled={busy}>Retry allocation →</button></div>}
    <div className="meal-heading"><div><div className="section-index">03 / DISTRIBUTION</div><h2>Meal status</h2></div><span>ONE PER ROUND</span></div><div className="meal-list">{meals.map((item, index) => { const taken = view.participant.mealsTaken?.includes(item.id); return <div className="meal-row" key={item.id}><div className="meal-number">0{index + 1}</div><div className="meal-name"><strong>{item.label}</strong><span>{taken ? 'Already served' : 'Not yet served'}</span></div>{taken ? <><span className="served">✓ Served</span>{admin && <button className="undo" onClick={() => meal(item.id, true)} disabled={busy}>Undo</button>}</> : <button className="serve" onClick={() => meal(item.id)} disabled={busy}>Mark served +</button>}</div>; })}</div>
    <details className="details-action"><summary>Replace a lost card <span>＋</span></summary><form onSubmit={replace}><p>The old card will be revoked. Verify the participant’s identity first.</p><label>New card number<input value={replacement} onChange={e => setReplacement(e.target.value)} required/></label><label>Reason<input value={reason} onChange={e => setReason(e.target.value)} minLength={3} required/></label><button className="secondary" disabled={busy}>Replace card</button></form></details>
    {admin && !recovering && <details className="details-action" key={view.participant.id}><summary>Edit participant details <span>＋</span></summary><form onSubmit={editPerson}><label>Name<input name="name" defaultValue={view.participant.name} required/></label><label>Email<input name="email" type="email" defaultValue={view.participant.email} required/></label><label>College<input name="college" defaultValue={view.participant.college}/></label><button className="secondary" disabled={busy}>Save details</button></form></details>}
    {admin && !recovering && <details className="details-action"><summary>Move team to another room <span>＋</span></summary><form onSubmit={move}><label>Room number<input value={room} onChange={e => setRoom(e.target.value)} required/></label><label>Reason<input value={roomReason} onChange={e => setRoomReason(e.target.value)} minLength={3} required/></label><button className="secondary" disabled={busy}>Move team</button></form></details>}</>}</section></div>{admin && <details className="desk-panel inventory"><summary>Room inventory <span>＋</span></summary><p>Paste one room as JSON. Each slot needs a label and its physical row. Rooms with teams cannot be edited.</p><form onSubmit={saveInventory}><label>Room data<textarea value={inventory} onChange={e => setInventory(e.target.value)} required placeholder={'{"number":"AB4-104","capacity":56,"hardware":false,"small":true,"enabled":true,"slots":[{"label":"104-T1","row":"C2","enabled":true},{"label":"104-T2","row":"C2","enabled":true}]}'} /></label><button className="secondary" disabled={busy}>Save room</button></form></details>}<footer className="desk-footer">IEEE DTU <span>BUILT FOR THE PEOPLE BEHIND THE EVENT.</span> VIHAAN X / 2026</footer></div>}</main>;
}
