'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(token ? '/api/admin/password-reset/complete' : '/api/admin/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token ? { token, password } : { email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
      setNotice(data.message || 'Password updated. You can return to sign in.');
      setPassword('');
      setConfirmation('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The request could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-grow items-start px-4 py-16 sm:px-6">
      <form onSubmit={submit} className="w-full space-y-5 border border-[#33343b] bg-[#0c0e14] p-6 sm:p-8">
        <div>
          <p className="font-label-mono-sm text-xs uppercase text-[#cdf200]">Admin // Account access</p>
          <h1 className="mt-2 font-headline-lg uppercase text-white">{token ? 'Set a password' : 'Reset password'}</h1>
          <p className="mt-2 font-body-sm text-[#8f96a3]">{token ? 'Choose a new password for your account.' : 'Enter your account email and, if it is registered, a secure reset link will be sent.'}</p>
        </div>
        {error && <p role="alert" className="border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="border border-[#637500] bg-[#1d1f26] p-3 text-sm text-[#cdf200]">{notice}</p>}
        {token ? (
          <>
            <label className="block space-y-1 text-sm text-[#8f96a3]">
              New password
              <input required minLength={14} maxLength={72} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white" />
            </label>
            <label className="block space-y-1 text-sm text-[#8f96a3]">
              Confirm password
              <input required minLength={14} maxLength={72} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white" />
            </label>
          </>
        ) : (
          <label className="block space-y-1 text-sm text-[#8f96a3]">
            Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-[#33343b] bg-[#191b22] px-3 py-2 text-white" />
          </label>
        )}
        <button disabled={busy || (Boolean(token) && password !== confirmation)} className="w-full bg-[#cdf200] px-4 py-3 font-label-caps font-bold uppercase text-[#0a0b0e] disabled:opacity-50">
          {busy ? 'Submitting…' : token ? 'Set password' : 'Send reset link'}
        </button>
        <a href="/admin" className="block text-center text-sm text-[#8f96a3] hover:text-white">Return to sign in</a>
      </form>
    </main>
  );
}
