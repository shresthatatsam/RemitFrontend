import { useState, type FormEvent } from 'react';
import { CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthFrame from './AuthFrame';
import { useAuth } from './AuthContext';
export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    async function submit(e: FormEvent) {
        e.preventDefault();
        setError(''); setBusy(true);
        try { await register(name, email, password); setDone(true); }
        catch (err) { setError(err instanceof Error ? err.message : 'Could not create your account.'); }
        finally { setBusy(false); }
    }
    return <AuthFrame mode="register" title={done ? 'Check your inbox.' : 'Let’s get you started.'} subtitle={done ? 'Your registration request has been received.' : 'Create an account to manage your international transfers.'}>{done ? <div className="success-panel"><CheckCircle2 size={36} /><h3>Almost there!</h3><p>In a live environment, we’ll send a verification link to <strong>{email}</strong>. Demo mode does not send real email.</p><button className="btn btn-primary auth-submit" onClick={() => navigate('/login')}>Go to log in →</button></div> : <form className="auth-form" onSubmit={submit}><label htmlFor="fullName">Full name</label><div className="input-wrap"><UserRound size={17} /><input id="fullName" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required /></div><label htmlFor="regEmail">Email address</label><div className="input-wrap"><Mail size={17} /><input id="regEmail" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div><label htmlFor="regPassword">Create password</label><div className="input-wrap"><LockKeyhole size={17} /><input id="regPassword" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} /></div>{error && <div className="form-error">{error}</div>}<div className="password-rule"><CheckCircle2 size={15} /> Use at least 8 characters for a stronger password.</div><button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <span>→</span></button><p className="form-small-note">You’ll need to complete identity verification before requesting transfers.</p></form>}</AuthFrame>;
}
