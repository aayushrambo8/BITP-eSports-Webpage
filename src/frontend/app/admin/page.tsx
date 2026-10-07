'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type ResourceKey = 'events' | 'matches' | 'sessions' | 'results' | 'games' | 'members' | 'officers' | 'achievements' | 'contact';
type SectionKey = ResourceKey | 'users' | 'account' | 'activity';
type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'date' | 'datetime-local' | 'number' | 'textarea' | 'checkbox' | 'select';
  required?: boolean;
  options?: string[];
};
type Resource = {
  label: string;
  endpoint: string;
  collection: string;
  fields: Field[];
};
type Entry = Record<string, unknown> & { id?: string };
type AdminUser = { id: string; email: string; username: string | null; name: string; role: 'OWNER' | 'ADMIN' | 'MODERATOR'; isActive: boolean };
type AdminActivity = {
  id: string;
  actorUsername: string | null;
  actorName: string;
  actorEmail: string;
  action: string;
  entity: string;
  itemLabel: string;
  createdAt: string;
};
type AdminProfile = Pick<AdminUser, 'id' | 'email' | 'username' | 'name' | 'role'>;

const resources: Record<ResourceKey, Resource> = {
  events: {
    label: 'Events',
    endpoint: '/api/admin/events',
    collection: 'events',
    fields: [
      { name: 'title', label: 'Event title', required: true },
      { name: 'dateStr', label: 'Date label', required: true },
      { name: 'timeStr', label: 'Time', required: true },
      { name: 'isoDate', label: 'Date and time', type: 'datetime-local', required: true },
      { name: 'discipline', label: 'Game / discipline', required: true },
      { name: 'location', label: 'Location', required: true },
      { name: 'locationSub', label: 'Location details' },
      { name: 'format', label: 'Format', required: true },
      { name: 'formatSub', label: 'Format details' },
      { name: 'statusBadge', label: 'Status badge' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'slotsFilled', label: 'Slots filled', type: 'number' },
      { name: 'slotsTotal', label: 'Total slots', type: 'number' },
      { name: 'isSpotlight', label: 'Feature this event', type: 'checkbox' },
    ],
  },
  matches: {
    label: 'Matches',
    endpoint: '/api/admin/matches',
    collection: 'matches',
    fields: [
      { name: 'discipline', label: 'Game / discipline', required: true },
      { name: 'datetime', label: 'Date and time label', required: true },
      { name: 'isoDate', label: 'Date and time', type: 'datetime-local', required: true },
      { name: 'opponent', label: 'Opponent', required: true },
      { name: 'league', label: 'League', required: true },
      { name: 'streamType', label: 'Broadcast type' },
      { name: 'streamUrl', label: 'Stream URL', type: 'url' },
    ],
  },
  sessions: {
    label: 'Weekly activities',
    endpoint: '/api/admin/sessions',
    collection: 'sessions',
    fields: [
      { name: 'tag', label: 'Category', required: true },
      { name: 'title', label: 'Activity title', required: true },
      { name: 'time', label: 'Time', required: true },
      { name: 'location', label: 'Location', required: true },
      { name: 'details', label: 'Details', type: 'textarea' },
    ],
  },
  results: {
    label: 'Results',
    endpoint: '/api/admin/results',
    collection: 'results',
    fields: [
      { name: 'discipline', label: 'Game / discipline', required: true },
      { name: 'league', label: 'League' },
      { name: 'badge', label: 'Outcome', type: 'select', options: ['WIN', 'SWEEP', 'COMPLETED', 'LOSS'], required: true },
      { name: 'team1', label: 'Team one', required: true },
      { name: 'score1', label: 'Score one', required: true },
      { name: 'team2', label: 'Team two', required: true },
      { name: 'score2', label: 'Score two', required: true },
      { name: 'subtext', label: 'Result notes', type: 'textarea' },
    ],
  },
  games: {
    label: 'Games & teams',
    endpoint: '/api/admin/games',
    collection: 'games',
    fields: [
      { name: 'slug', label: 'URL-safe ID (e.g. valorant)', required: true },
      { name: 'name', label: 'Game / team name', required: true },
      { name: 'tag', label: 'Short tag', required: true },
      { name: 'divisionBadge', label: 'Division', required: true },
      { name: 'category', label: 'Platform', type: 'select', options: ['PC', 'CONSOLE', 'MOBILE'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'captain', label: 'Captain', required: true },
      { name: 'practiceSchedule', label: 'Practice schedule', required: true },
      { name: 'status', label: 'Roster status', required: true },
      { name: 'statusType', label: 'Status type', type: 'select', options: ['open', 'scrims', 'active', 'recruiting'], required: true },
      { name: 'league', label: 'League', required: true },
      { name: 'accentColor', label: 'Accent color (hex)' },
      { name: 'badgeBg', label: 'Badge background (rgba)' },
      { name: 'gameArt', label: 'Game art URL', type: 'url', required: true },
      { name: 'tagline', label: 'Tagline', required: true },
    ],
  },
  members: {
    label: 'Team rosters',
    endpoint: '/api/admin/members',
    collection: 'members',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'handle', label: 'Handle', required: true },
      { name: 'role', label: 'Team role', required: true },
      { name: 'gameSlug', label: 'Game slug', required: true },
      { name: 'yearMajor', label: 'Year and major', required: true },
      { name: 'tag', label: 'Roster details', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
  },
  officers: {
    label: 'Committee & members',
    endpoint: '/api/admin/officers',
    collection: 'officers',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'handle', label: 'Handle', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'yearMajor', label: 'Year and major', required: true },
      { name: 'tag', label: 'Short tag', required: true },
      { name: 'discord', label: 'Discord handle', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
  },
  achievements: {
    label: 'Achievements',
    endpoint: '/api/admin/achievements',
    collection: 'achievements',
    fields: [
      { name: 'title', label: 'Achievement', required: true },
      { name: 'game', label: 'Game / discipline', required: true },
      { name: 'award', label: 'Award / placement', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'description', label: 'Details', type: 'textarea', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
  },
  contact: {
    label: 'Contact inbox',
    endpoint: '/api/admin/contact',
    collection: 'submissions',
    fields: [],
  },
};

const resourceKeys = Object.keys(resources) as ResourceKey[];

function emptyForm(resource: Resource): Record<string, string | boolean> {
  return Object.fromEntries(
    resource.fields.map((field) => [
      field.name,
      field.type === 'checkbox' ? false : '',
    ])
  );
}

function displayDateTime(value: unknown) {
  if (typeof value !== 'string') return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 16);
}

function displayDate(value: unknown) {
  if (typeof value !== 'string') return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState<SectionKey>('events');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyForm(resources.events));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<AdminUser['role'] | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'MODERATOR' as AdminUser['role'] });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profileUsername, setProfileUsername] = useState('');
  const [activity, setActivity] = useState<AdminActivity[]>([]);

  const resource = resources[active === 'users' || active === 'account' || active === 'activity' ? 'events' : active];
  const endpoint = resource.endpoint;

  const loadEntries = useCallback(async () => {
    const response = await fetch(endpoint, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load this section.');
    setEntries(Array.isArray(data[resource.collection]) ? data[resource.collection] : []);
  }, [endpoint, resource.collection]);

  useEffect(() => {
    let activeRequest = true;
    void fetch('/api/admin/logout', { cache: 'no-store' })
      .then(async (response) => {
        if (activeRequest) {
          setAuthenticated(response.ok);
          if (response.ok) {
            const data = await response.json();
            setRole(data.user.role);
          }
        }
      })
      .catch(() => {
        if (activeRequest) setError('Unable to check administrator access.');
      })
      .finally(() => {
        if (activeRequest) setChecking(false);
      });
    return () => {
      activeRequest = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated || active === 'users' || active === 'account' || active === 'activity') return;
    let activeRequest = true;
    void fetch(endpoint, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load this section.');
        if (activeRequest) setEntries(Array.isArray(data[resource.collection]) ? data[resource.collection] : []);
      })
      .catch((loadError: unknown) => {
        if (activeRequest) setError(loadError instanceof Error ? loadError.message : 'Could not load this section.');
      });
    return () => {
      activeRequest = false;
    };
  }, [active, authenticated, endpoint, resource.collection]);

  useEffect(() => {
    if (!authenticated || active !== 'activity') return;
    let activeRequest = true;
    void fetch('/api/admin/activity', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load activity.');
        if (activeRequest) setActivity(data.activity);
      })
      .catch((loadError: unknown) => {
        if (activeRequest) setError(loadError instanceof Error ? loadError.message : 'Could not load activity.');
      });
    return () => {
      activeRequest = false;
    };
  }, [active, authenticated]);

  useEffect(() => {
    if (!authenticated || active !== 'account') return;
    let activeRequest = true;
    void fetch('/api/admin/profile', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load profile.');
        if (activeRequest) {
          setProfile(data.profile);
          setProfileName(data.profile.name);
          setProfileUsername(data.profile.username ?? '');
        }
      })
      .catch((loadError: unknown) => {
        if (activeRequest) setError(loadError instanceof Error ? loadError.message : 'Could not load profile.');
      });
    return () => {
      activeRequest = false;
    };
  }, [active, authenticated]);

  const fields = useMemo(() => resource.fields, [resource.fields]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      setAuthenticated(true);
      setRole(data.user.role);
      window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: data.user }));
      setPassword('');
      setNotice('Signed in successfully.');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  async function loadUsers() {
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load accounts.');
    setUsers(data.users);
  }

  useEffect(() => {
    if (authenticated && active === 'users' && (role === 'OWNER' || role === 'ADMIN')) {
      let activeRequest = true;
      void fetch('/api/admin/users', { cache: 'no-store' })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Could not load accounts.');
          if (activeRequest) setUsers(data.users);
        })
        .catch((loadError: unknown) => {
          if (activeRequest) setError(loadError instanceof Error ? loadError.message : 'Could not load accounts.');
        });
      return () => {
        activeRequest = false;
      };
    }
    return undefined;
  }, [active, authenticated, role]);

  async function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not invite this user.');
      setNewUser({ email: '', role: 'MODERATOR' });
      setNotice('Invitation sent. The account holder must set a password within 30 minutes.');
      await loadUsers();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Could not invite this user.');
    } finally {
      setBusy(false);
    }
  }

  async function updateUser(user: AdminUser, changes: Partial<Pick<AdminUser, 'role' | 'isActive'>>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...changes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update this account.');
      setNotice('Account permissions updated. Any existing session was signed out.');
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update this account.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (!window.confirm(`Delete ${user.role} account ${user.email}? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/users?id=${encodeURIComponent(user.id)}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete this account.');
      setNotice('User account deleted.');
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this account.');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not change password.');
      setCurrentPassword('');
      setNewPassword('');
      setAuthenticated(false);
      setNotice('Password changed. Sign in again with the new password.');
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : 'Could not change password.');
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, username: profileUsername }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update profile.');
      setProfile(data.profile);
      setProfileUsername(data.profile.username);
      window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: data.profile }));
      setNotice('Profile updated.');
    } catch (profileError) {
      setError(profileError instanceof Error ? profileError.message : 'Could not update profile.');
    } finally {
      setBusy(false);
    }
  }

  function startEditing(entry: Entry) {
    const values: Record<string, string | boolean> = emptyForm(resource);
    for (const field of fields) {
      const value = entry[field.name];
      if (field.type === 'checkbox') values[field.name] = value === true;
      else if (field.type === 'date') values[field.name] = displayDate(value);
      else if (field.type === 'datetime-local') values[field.name] = displayDateTime(value);
      else values[field.name] = value == null ? '' : String(value);
    }
    setEditingId(typeof entry.id === 'string' ? entry.id : null);
    setForm(values);
    setNotice('');
    setError('');
  }

  async function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const body: Record<string, string | number | boolean | null> = {};
      for (const field of fields) {
        const value = form[field.name];
        if (field.type === 'checkbox') body[field.name] = value === true;
        else if (field.type === 'number') body[field.name] = value === '' ? null : Number(value);
        else if (field.type === 'datetime-local' && value) body[field.name] = new Date(String(value)).toISOString();
        else body[field.name] = value === '' ? null : String(value);
      }
      if (editingId) body.id = editingId;

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save this item.');

      setForm(emptyForm(resource));
      setEditingId(null);
      setNotice(editingId ? 'Changes saved.' : 'Item added.');
      await loadEntries();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this item.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteEntry(id: string) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete this item.');
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm(resource));
      }
      setNotice('Item deleted.');
      await loadEntries();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this item.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleSubmission(entry: Entry) {
    const id = typeof entry.id === 'string' ? entry.id : '';
    const status = entry.status === 'READ' ? 'PENDING' : 'READ';
    if (!id) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update the submission.');
      await loadEntries();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update the submission.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      setRole(null);
      window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: null }));
      setEntries([]);
      setNotice('');
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return <main className="mx-auto w-full max-w-5xl flex-grow p-8 text-white">Checking administrator access…</main>;
  }

  if (!authenticated) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-grow items-start px-4 py-16 sm:px-6">
        <form onSubmit={submitLogin} className="w-full space-y-5 border border-[#33343b] bg-[#0c0e14] p-6 sm:p-8">
          <div>
            <p className="font-label-mono-sm text-xs uppercase text-[#cdf200]">Admin // Sign in</p>
            <h1 className="mt-2 font-headline-lg uppercase text-white">Club content manager</h1>
            <p className="mt-2 font-body-sm text-[#8f96a3]">Use an administrator account provided by the club.</p>
          </div>
          {error && <p role="alert" className="border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
          <label className="block space-y-1 text-sm text-[#8f96a3]">
            Email or username
            <input required autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white" />
          </label>
          <label className="block space-y-1 text-sm text-[#8f96a3]">
            Password
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white" />
          </label>
          <button disabled={busy} className="w-full bg-[#cdf200] px-4 py-3 font-label-caps font-bold uppercase text-[#0a0b0e] disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <a href="/admin/reset-password" className="block text-center text-sm text-[#8f96a3] hover:text-white">Forgot password?</a>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-grow px-4 py-8 sm:px-6 lg:px-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#33343b] pb-4">
        <div>
          <p className="font-label-mono-sm text-xs uppercase text-[#cdf200]">Admin // Content control</p>
          <h1 className="mt-1 font-headline-xl uppercase text-white">Club content manager</h1>
          <p className="mt-1 font-body-sm text-[#8f96a3]">Changes publish directly to the public site.</p>
        </div>
        <button onClick={logout} disabled={busy} className="border border-[#33343b] bg-[#191b22] px-4 py-2 font-label-caps text-xs uppercase text-white hover:border-[#cdf200]">
          Sign out
        </button>
      </div>

      <nav aria-label="Content sections" className="mb-6 flex flex-wrap gap-2">
        {resourceKeys.filter((key) => key !== 'contact' || role !== 'MODERATOR').map((key) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              setEditingId(null);
              setForm(emptyForm(resources[key]));
              setError('');
              setNotice('');
            }}
            className={`border px-3 py-2 text-xs font-bold uppercase ${active === key ? 'border-[#cdf200] bg-[#cdf200] text-[#0a0b0e]' : 'border-[#33343b] bg-[#191b22] text-[#8f96a3] hover:text-white'}`}
          >
            {resources[key].label}
          </button>
        ))}
        {(role === 'OWNER' || role === 'ADMIN') && (
          <button onClick={() => { setActive('users'); setError(''); setNotice(''); }} className={`border px-3 py-2 text-xs font-bold uppercase ${active === 'users' ? 'border-[#cdf200] bg-[#cdf200] text-[#0a0b0e]' : 'border-[#33343b] bg-[#191b22] text-[#8f96a3] hover:text-white'}`}>
            User accounts
          </button>
        )}
        <button onClick={() => { setActive('account'); setError(''); setNotice(''); }} className={`border px-3 py-2 text-xs font-bold uppercase ${active === 'account' ? 'border-[#cdf200] bg-[#cdf200] text-[#0a0b0e]' : 'border-[#33343b] bg-[#191b22] text-[#8f96a3] hover:text-white'}`}>
          My profile
        </button>
        <button onClick={() => { setActive('activity'); setError(''); setNotice(''); }} className={`border px-3 py-2 text-xs font-bold uppercase ${active === 'activity' ? 'border-[#cdf200] bg-[#cdf200] text-[#0a0b0e]' : 'border-[#33343b] bg-[#191b22] text-[#8f96a3] hover:text-white'}`}>
          Activity log
        </button>
      </nav>

      {error && <p role="alert" className="mb-4 border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
      {notice && <p role="status" className="mb-4 border border-[#637500] bg-[#1d1f26] p-3 text-sm text-[#cdf200]">{notice}</p>}

      {active === 'users' && (role === 'OWNER' || role === 'ADMIN') ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1fr)]">
          <section className="border border-[#33343b] bg-[#0c0e14] p-5">
            <h2 className="mb-4 font-headline-md uppercase text-white">Invite a user</h2>
            <form onSubmit={inviteUser} className="space-y-4">
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Email<input required type="email" maxLength={254} value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" /></label>
              {role === 'OWNER' ? (
                <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Privilege<select value={newUser.role} onChange={(event) => setNewUser({ ...newUser, role: event.target.value as AdminUser['role'] })} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white"><option value="MODERATOR">Moderator</option><option value="ADMIN">Admin</option><option value="OWNER">Owner</option></select></label>
              ) : <p className="text-sm text-[#8f96a3]">New accounts are created as <span className="font-bold text-[#cdf200]">Moderator</span>.</p>}
              <button disabled={busy} className="bg-[#cdf200] px-4 py-2 font-label-caps text-xs font-bold uppercase text-[#0a0b0e] disabled:opacity-50">Send invitation</button>
            </form>
          </section>
          <section className="space-y-3">
            <h2 className="font-headline-md uppercase text-white">Accounts ({users.length})</h2>
            {users.map((user) => (
              <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 border border-[#33343b] bg-[#0c0e14] p-4">
                <div><h3 className="font-semibold text-white">{user.username ? `@${user.username}` : user.name}</h3><p className="text-sm text-[#8f96a3]">{user.email}<span aria-hidden="true"> / </span>{user.isActive ? user.role : `${user.role} / DISABLED`}</p></div>
                <div className="flex flex-wrap gap-2">
                  {role === 'OWNER' ? (
                    <>
                      <select aria-label={`Privilege for ${user.email}`} value={user.role} disabled={busy || !user.isActive} onChange={(event) => void updateUser(user, { role: event.target.value as AdminUser['role'] })} className="border border-[#33343b] bg-[#191b22] px-2 py-1 text-xs text-white"><option value="OWNER">Owner</option><option value="ADMIN">Admin</option><option value="MODERATOR">Moderator</option></select>
                      <button disabled={busy} onClick={() => void updateUser(user, { isActive: !user.isActive })} className="border border-[#33343b] px-3 py-1 text-xs uppercase text-white">{user.isActive ? 'Disable' : 'Enable'}</button>
                      <button disabled={busy} onClick={() => void deleteUser(user)} className="border border-red-900 px-3 py-1 text-xs uppercase text-red-200 hover:bg-red-950/40">Delete</button>
                    </>
                  ) : user.role === 'MODERATOR' ? (
                    <button disabled={busy} onClick={() => void deleteUser(user)} className="border border-red-900 px-3 py-1 text-xs uppercase text-red-200 hover:bg-red-950/40">Delete moderator</button>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        </div>
      ) : active === 'account' ? (
        <div className="grid max-w-3xl gap-6">
          <section className="border border-[#33343b] bg-[#0c0e14] p-5">
            <h2 className="mb-4 font-headline-md uppercase text-white">My profile</h2>
            <p className="mb-4 text-sm text-[#8f96a3]">Your name and account role identify you in the site activity log.</p>
            <form onSubmit={saveProfile} className="space-y-4">
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Display name<input required maxLength={100} value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" /></label>
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Username<input required minLength={3} maxLength={30} pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,29}" value={profileUsername} onChange={(event) => setProfileUsername(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" /><span className="block normal-case">3–30 letters, numbers, dots, underscores, or hyphens.</span></label>
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Email<input readOnly value={profile?.email ?? ''} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-[#8f96a3]" /></label>
              <p className="text-sm text-[#8f96a3]">Role: <span className="font-bold text-[#cdf200]">{profile?.role ?? role}</span></p>
              <button disabled={busy} className="bg-[#cdf200] px-4 py-2 font-label-caps text-xs font-bold uppercase text-[#0a0b0e] disabled:opacity-50">Save profile</button>
            </form>
          </section>
          <section className="border border-[#33343b] bg-[#0c0e14] p-5">
            <h2 className="mb-4 font-headline-md uppercase text-white">Change your password</h2>
            <form onSubmit={changePassword} className="space-y-4">
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" /></label>
              <label className="block space-y-1 text-xs uppercase text-[#8f96a3]">New password (14–72 bytes)<input required minLength={14} maxLength={72} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" /></label>
              <button disabled={busy} className="bg-[#cdf200] px-4 py-2 font-label-caps text-xs font-bold uppercase text-[#0a0b0e] disabled:opacity-50">Change password</button>
            </form>
          </section>
        </div>
      ) : active === 'activity' ? (
        <section className="space-y-3">
          <h2 className="font-headline-md uppercase text-white">Recent admin activity</h2>
          {activity.length === 0 && <p className="border border-[#33343b] bg-[#0c0e14] p-5 text-sm text-[#8f96a3]">No changes have been recorded yet.</p>}
          {activity.map((item) => (
            <article key={item.id} className="border border-[#33343b] bg-[#0c0e14] p-4">
              <p className="font-semibold text-white">{item.actorUsername ? `@${item.actorUsername}` : item.actorName} <span className="font-normal text-[#8f96a3]">({item.actorEmail})</span></p>
              <p className="mt-1 text-sm text-[#8f96a3]">{item.action} {item.entity}: <span className="text-[#e2e2ea]">{item.itemLabel}</span></p>
              <time className="mt-1 block text-xs text-[#8f96a3]" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
            </article>
          ))}
        </section>
      ) : active !== 'contact' ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
          <section className="border border-[#33343b] bg-[#0c0e14] p-5">
            <h2 className="mb-4 font-headline-md uppercase text-white">{editingId ? `Edit ${resource.label}` : `Add ${resource.label}`}</h2>
            <form onSubmit={saveEntry} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={`space-y-1 text-xs uppercase tracking-wide text-[#8f96a3] ${field.type === 'textarea' ? 'sm:col-span-2' : ''} ${field.type === 'checkbox' ? 'flex items-center gap-3' : ''}`}>
                  {field.type === 'checkbox' ? (
                    <>
                      <input type="checkbox" checked={form[field.name] === true} onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })} className="h-4 w-4 accent-[#cdf200]" />
                      <span>{field.label}</span>
                    </>
                  ) : field.type === 'textarea' ? (
                    <>
                      {field.label}
                      <textarea required={field.required} value={String(form[field.name] ?? '')} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} rows={3} maxLength={4000} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" />
                    </>
                  ) : field.type === 'select' ? (
                    <>
                      {field.label}
                      <select required={field.required} value={String(form[field.name] ?? '')} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white">
                        <option value="">Select…</option>
                        {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </>
                  ) : (
                    <>
                      {field.label}
                      <input required={field.required} type={field.type ?? 'text'} min={field.type === 'number' ? 0 : undefined} value={String(form[field.name] ?? '')} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 normal-case text-white" />
                    </>
                  )}
                </label>
              ))}
              <div className="flex gap-2 sm:col-span-2">
                <button disabled={busy} className="bg-[#cdf200] px-4 py-2 font-label-caps text-xs font-bold uppercase text-[#0a0b0e] disabled:opacity-50">
                  {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add item'}
                </button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm(resource)); }} className="border border-[#33343b] px-4 py-2 text-xs uppercase text-white">Cancel</button>}
              </div>
            </form>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md uppercase text-white">{resource.label} ({entries.length})</h2>
            {entries.length === 0 && <p className="border border-[#33343b] bg-[#0c0e14] p-5 text-sm text-[#8f96a3]">No items yet. Add your first record using the form.</p>}
            {entries.map((entry, index) => {
              const id = typeof entry.id === 'string' ? entry.id : '';
              const title = String(entry.title ?? entry.name ?? entry.discipline ?? entry.tag ?? `Item ${index + 1}`);
              const summary = String(entry.dateStr ?? entry.datetime ?? entry.time ?? entry.role ?? entry.league ?? '');
              return (
                <article key={id || index} className="border border-[#33343b] bg-[#0c0e14] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-white">{title}</h3>
                      {summary && <p className="mt-1 break-words text-sm text-[#8f96a3]">{summary}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => startEditing(entry)} className="border border-[#33343b] px-3 py-1 text-xs uppercase text-white hover:border-[#cdf200]">Edit</button>
                      <button onClick={() => void deleteEntry(id)} disabled={!id || busy} className="border border-red-900 px-3 py-1 text-xs uppercase text-red-200 hover:bg-red-950/40 disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="font-headline-md uppercase text-white">Recent contact submissions ({entries.length})</h2>
          {entries.length === 0 && <p className="border border-[#33343b] bg-[#0c0e14] p-5 text-sm text-[#8f96a3]">No messages received.</p>}
          {entries.map((entry, index) => {
            const id = typeof entry.id === 'string' ? entry.id : '';
            return (
              <article key={id || index} className="border border-[#33343b] bg-[#0c0e14] p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{String(entry.name ?? 'Unknown sender')} <span className="font-normal text-[#8f96a3]">— {String(entry.email ?? '')}</span></h3>
                    <p className="mt-1 text-xs uppercase text-[#cdf200]">{String(entry.topic ?? 'General')} {entry.game ? `// ${String(entry.game)}` : ''}{' // '}{String(entry.status ?? 'PENDING')}</p>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm text-[#d1d5db]">{String(entry.message ?? '')}</p>
                  </div>
                  <div className="flex h-fit gap-2">
                    <button disabled={busy} onClick={() => void toggleSubmission(entry)} className="border border-[#33343b] px-3 py-1 text-xs uppercase text-white">
                      {entry.status === 'READ' ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button disabled={busy || !id} onClick={() => void deleteEntry(id)} className="border border-red-900 px-3 py-1 text-xs uppercase text-red-200">Delete</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
