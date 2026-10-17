// // import { useState, type FormEvent } from 'react';
// // import { Building2, Plus, Search, Trash2, UserRound, X } from 'lucide-react';
// // import PageHeader from '../../components/ui/PageHeader';
// // import type { Beneficiary } from '../../types';
// // const initial: Beneficiary[] = 
// // [
// //     { id: 'b1', accountName: 'Anisha Shrestha', accountNumber: '•••• •••• 4821', bankName: 'Nabil Bank', country: 'Nepal', currency: 'NPR' }, 
// //     { id: 'b2', accountName: 'Ramesh Karki', accountNumber: '•••• •••• 1975', bankName: 'Global IME Bank', country: 'Nepal', currency: 'NPR' }, 
// //     { id: 'b3', accountName: 'Mina Gurung', accountNumber: '•••• •••• 6630', bankName: 'NIC ASIA Bank', country: 'Nepal', currency: 'NPR' }];
// // export default function BeneficiariesPage() {
// //     const [items, setItems] = useState(initial);
// //     const [query, setQuery] = useState('');
// //     const [showForm, setShowForm] = useState(false);
// //     const [name, setName] = useState('');
// //     const [account, setAccount] = useState('');
// //     const [bank, setBank] = useState('');
// //     const [country, setCountry] = useState('Nepal');
// //     const [success, setSuccess] = useState('');
// //     function submit(e: FormEvent) {
// //         e.preventDefault();
// //         setItems(old => [...old, { id: crypto.randomUUID(), accountName: name, accountNumber: `•••• ${account.slice(-4)}`, bankName: bank, country, currency: country === 'Nepal' ? 'NPR' : 'USD' }]); setName(''); setAccount(''); setBank(''); setShowForm(false); setSuccess('Beneficiary added in demo mode.'); setTimeout(() => setSuccess(''), 3500);
// //     }
// //     const filtered = items.filter(x => `${x.accountName} ${x.bankName}`.toLowerCase().includes(query.toLowerCase()));
// //     return <>
// //     <PageHeader eyebrow="YOUR PEOPLE, ONE PLACE" title="Beneficiaries" description="Manage the recipients you may want to send money to." 
// //     action={<button className="btn btn-primary" 
// //         onClick={() => setShowForm(true)}><Plus size={16} /> Add beneficiary</button>} />
// //         {success && <div className="inline-success"><span>✓</span>{success}</div>}
// //         <div className="summary-strip"><div><span className="summary-icon"><UserRound size={18} /></span>
// //         <div><strong>{items.length} saved recipients</strong><p>Your beneficiary list</p></div></div>
// //         <div className="search-wrap"><Search size={17} /><input aria-label="Search beneficiaries" placeholder="Search recipients or banks" value={query} onChange={e => setQuery(e.target.value)} /></div></div><div className="beneficiary-grid">{filtered.map((b, i) => <article className="beneficiary-card" key={b.id}><div className="beneficiary-card-top"><span className={`beneficiary-avatar bcolor-${i % 3}`}>{b.accountName.split(' ').map(x => x[0]).join('')}</span><button className="icon-button small-icon" aria-label={`Remove ${b.accountName}`} onClick={() => { if (confirm(`Remove ${b.accountName} from this demo list?`)) setItems(old => old.filter(x => x.id !== b.id)); }}><Trash2 size={16} /></button></div><h3>{b.accountName}</h3><p className="beneficiary-country">{b.country} <span>·</span> {b.currency}</p><div className="beneficiary-detail"><span><Building2 size={15} /> Bank</span><strong>{b.bankName}</strong></div><div className="beneficiary-detail"><span>Account number</span><strong className="mono">{b.accountNumber}</strong></div><div className="beneficiary-card-footer"><span className="verified-mini">✓ Saved recipient</span><span>•••</span></div></article>)}{!filtered.length && <div className="empty-state"><UserRound size={30} /><h3>No recipients found</h3><p>Try a different search or add a new beneficiary.</p></div>}</div>{showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="modal-card" onClick={e => e.stopPropagation()}><div className="modal-heading"><div><h3>Add beneficiary</h3><p>Add the bank details of your recipient.</p></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X /></button></div><form className="modal-form" onSubmit={submit}><div className="field-group"><label htmlFor="benName">Account holder name</label><input id="benName" value={name} onChange={e => setName(e.target.value)} required placeholder="Full name as on bank account" /></div><div className="field-group"><label htmlFor="benCountry">Recipient country</label><select id="benCountry" value={country} onChange={e => setCountry(e.target.value)}><option>Nepal</option><option>India</option><option>United Kingdom</option><option>United States</option><option>Australia</option></select></div><div className="field-group"><label htmlFor="benBank">Bank name</label><input id="benBank" value={bank} onChange={e => setBank(e.target.value)} required placeholder="Recipient's bank" /></div><div className="field-group"><label htmlFor="benAccount">Bank account number</label><input id="benAccount" value={account} onChange={e => setAccount(e.target.value)} required minLength={4} placeholder="Enter account number" /></div><div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={() => setShowForm(false)}>Cancel</button><button className="btn btn-primary" type="submit">Save beneficiary</button></div><p className="form-small-note">Demo only: details stay in browser memory and are not sent to a bank.</p></form></div></div>}</>;
// // }

// import { useState, useEffect, type FormEvent } from 'react';
// import {
//     Building2,
//     Plus,
//     Search,
//     Trash2,
//     UserRound,
//     X,
// } from 'lucide-react';
// import PageHeader from '../../components/ui/PageHeader';
// import type { Beneficiary } from '../../types';

// const API_URL = 'https://localhost:7001/api/beneficiaries';

// interface ApiBeneficiary {
//     id: string;
//     ownerUserId: string;
//     accountHolderName: string;
//     accountNumber: string;
//     bankName: string;
//     bankCountry: string;
//     bankCode: string;
//     branchName: string;
//     createdAt: string;
// }

// function mapBeneficiary(b: ApiBeneficiary): Beneficiary {
//     return {
//         id: b.id,
//         accountName: b.accountHolderName,
//         accountNumber: `•••• ${b.accountNumber.slice(-4)}`,
//         bankName: b.bankName,
//         country: b.bankCountry,
//         currency: b.bankCountry === 'Nepal' ? 'NPR' : 'USD',
//     };
// }

// export default function BeneficiariesPage() {
//     const [items, setItems] = useState<Beneficiary[]>([]);
//     const [query, setQuery] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [name, setName] = useState('');
//     const [account, setAccount] = useState('');
//     const [bank, setBank] = useState('');
//     const [country, setCountry] = useState('Nepal');
//     const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const controller = new AbortController();

//         async function fetchBeneficiaries() {
//             try {
//                 setLoading(true);
//                 setError('');

//                 const response = await fetch(API_URL, {
//                     method: 'GET',
//                     headers: {
//                         Accept: 'application/json',
//                         // If your API requires JWT authentication:
//                         Authorization: `Bearer ${localStorage.getItem('remitly_token')}`,
//                     },
//                     signal: controller.signal,
//                 });

//                 if (!response.ok) {
//                     throw new Error(
//                         `Failed to fetch beneficiaries (${response.status})`
//                     );
//                 }

//                 const data: ApiBeneficiary[] = await response.json();
//                 setItems(data.map(mapBeneficiary));
//             } catch (err) {
//                 if (err instanceof Error && err.name === 'AbortError') {
//                     return;
//                 }

//                 setError(
//                     err instanceof Error
//                         ? err.message
//                         : 'Something went wrong while loading beneficiaries.'
//                 );
//             } finally {
//                 if (!controller.signal.aborted) {
//                     setLoading(false);
//                 }
//             }
//         }

//         void fetchBeneficiaries();

//         return () => controller.abort();
//     }, []);

//     // function submit(e: FormEvent<HTMLFormElement>) {
//     //     e.preventDefault();

//     //     // Demo-only: this does not save to the API.
//     //     setItems(old => [
//     //         ...old,
//     //         {
//     //             id: crypto.randomUUID(),
//     //             accountName: name,
//     //             accountNumber: `•••• ${account.slice(-4)}`,
//     //             bankName: bank,
//     //             country,
//     //             currency: country === 'Nepal' ? 'NPR' : 'USD',
//     //         },
//     //     ]);

//     //     setName('');
//     //     setAccount('');
//     //     setBank('');
//     //     setShowForm(false);
//     //     setSuccess('Beneficiary added in demo mode.');

//     //     setTimeout(() => setSuccess(''), 3500);
//     // }

//     const filtered = items.filter(b =>
//         `${b.accountName} ${b.bankName} ${b.country}`
//             .toLowerCase()
//             .includes(query.toLowerCase())
//     );


// async function submit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError('');
//     setSuccess('');

//     try {
//         const token = localStorage.getItem('remitly_token');

//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json',
//                 ...(token
//                     ? { Authorization: `Bearer ${token}` }
//                     : {}),
//             },
//             body: JSON.stringify({
//                 accountHolderName: name.trim(),
//                 accountNumber: account.trim(),
//                 bankName: bank.trim(),
//                 bankCountry: country,
//                 bankCode: '',
//                 branchName: '',
//             }),
//         });

//         if (!response.ok) {
//             const message = await response.text();

//             throw new Error(
//                 message || `Failed to save beneficiary (${response.status})`
//             );
//         }

//         const saved: ApiBeneficiary = await response.json();

//         setItems(old => [...old, mapBeneficiary(saved)]);

//         setName('');
//         setAccount('');
//         setBank('');
//         setCountry('Nepal');
//         setShowForm(false);
//         setSuccess('Beneficiary saved successfully.');

//         window.setTimeout(() => setSuccess(''), 3500);
//     } catch (err) {
//         setError(
//             err instanceof Error
//                 ? err.message
//                 : 'Unable to save beneficiary.'
//         );
//     }
// }

    
//     return (
//         <>
//             <PageHeader
//                 eyebrow="YOUR PEOPLE, ONE PLACE"
//                 title="Beneficiaries"
//                 description="Manage the recipients you may want to send money to."
//                 action={
//                     <button
//                         className="btn btn-primary"
//                         onClick={() => setShowForm(true)}
//                     >
//                         <Plus size={16} /> Add beneficiary
//                     </button>
//                 }
//             />

//             {success && (
//                 <div className="inline-success">
//                     <span>✓</span> {success}
//                 </div>
//             )}

//             {error && (
//                 <div className="inline-error" role="alert">
//                     {error}
//                     <button
//                         className="btn btn-quiet"
//                         onClick={() => window.location.reload()}
//                     >
//                         Retry
//                     </button>
//                 </div>
//             )}

//             <div className="summary-strip">
//                 <div>
//                     <span className="summary-icon">
//                         <UserRound size={18} />
//                     </span>
//                     <div>
//                         <strong>{items.length} saved recipients</strong>
//                         <p>Your beneficiary list</p>
//                     </div>
//                 </div>

//                 <div className="search-wrap">
//                     <Search size={17} />
//                     <input
//                         aria-label="Search beneficiaries"
//                         placeholder="Search recipients or banks"
//                         value={query}
//                         onChange={e => setQuery(e.target.value)}
//                     />
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="empty-state">
//                     <p>Loading beneficiaries...</p>
//                 </div>
//             ) : (
//                 <div className="beneficiary-grid">
//                     {filtered.map((b, i) => (
//                         <article className="beneficiary-card" key={b.id}>
//                             <div className="beneficiary-card-top">
//                                 <span className={`beneficiary-avatar bcolor-${i % 3}`}>
//                                     {b.accountName
//                                         .split(' ')
//                                         .map(x => x[0])
//                                         .join('')}
//                                 </span>

//                                 <button
//                                     className="icon-button small-icon"
//                                     aria-label={`Remove ${b.accountName}`}
//                                     onClick={() => {
//                                         if (
//                                             confirm(
//                                                 `Remove ${b.accountName} from this demo list?`
//                                             )
//                                         ) {
//                                             setItems(old =>
//                                                 old.filter(x => x.id !== b.id)
//                                             );
//                                         }
//                                     }}
//                                 >
//                                     <Trash2 size={16} />
//                                 </button>
//                             </div>

//                             <h3>{b.accountName}</h3>

//                             <p className="beneficiary-country">
//                                 {b.country} <span>·</span> {b.currency}
//                             </p>

//                             <div className="beneficiary-detail">
//                                 <span>
//                                     <Building2 size={15} /> Bank
//                                 </span>
//                                 <strong>{b.bankName}</strong>
//                             </div>

//                             <div className="beneficiary-detail">
//                                 <span>Account number</span>
//                                 <strong className="mono">
//                                     {b.accountNumber}
//                                 </strong>
//                             </div>

//                             <div className="beneficiary-card-footer">
//                                 <span className="verified-mini">
//                                     ✓ Saved recipient
//                                 </span>
//                                 <span>•••</span>
//                             </div>
//                         </article>
//                     ))}

//                     {!filtered.length && (
//                         <div className="empty-state">
//                             <UserRound size={30} />
//                             <h3>No recipients found</h3>
//                             <p>
//                                 {query
//                                     ? 'Try a different search.'
//                                     : 'No beneficiaries returned by the API.'}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {showForm && (
//                 <div
//                     className="modal-backdrop"
//                     onClick={() => setShowForm(false)}
//                 >
//                     <div
//                         className="modal-card"
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="modal-heading">
//                             <div>
//                                 <h3>Add beneficiary</h3>
//                                 <p>Add the bank details of your recipient.</p>
//                             </div>
//                             <button
//                                 className="icon-button"
//                                 onClick={() => setShowForm(false)}
//                                 aria-label="Close"
//                             >
//                                 <X />
//                             </button>
//                         </div>

//                         <form className="modal-form" onSubmit={submit}>
//                             <div className="field-group">
//                                 <label htmlFor="benName">
//                                     Account holder name
//                                 </label>
//                                 <input
//                                     id="benName"
//                                     value={name}
//                                     onChange={e => setName(e.target.value)}
//                                     required
//                                     placeholder="Full name as on bank account"
//                                 />
//                             </div>

//                             <div className="field-group">
//                                 <label htmlFor="benCountry">
//                                     Recipient country
//                                 </label>
//                                 <select
//                                     id="benCountry"
//                                     value={country}
//                                     onChange={e => setCountry(e.target.value)}
//                                 >
//                                     <option>Nepal</option>
//                                     <option>India</option>
//                                     <option>United Kingdom</option>
//                                     <option>United States</option>
//                                     <option>Australia</option>
//                                 </select>
//                             </div>

//                             <div className="field-group">
//                                 <label htmlFor="benBank">Bank name</label>
//                                 <input
//                                     id="benBank"
//                                     value={bank}
//                                     onChange={e => setBank(e.target.value)}
//                                     required
//                                     placeholder="Recipient's bank"
//                                 />
//                             </div>

//                             <div className="field-group">
//                                 <label htmlFor="benAccount">
//                                     Bank account number
//                                 </label>
//                                 <input
//                                     id="benAccount"
//                                     value={account}
//                                     onChange={e => setAccount(e.target.value)}
//                                     required
//                                     minLength={4}
//                                     placeholder="Enter account number"
//                                 />
//                             </div>

//                             <div className="modal-actions">
//                                 <button
//                                     type="button"
//                                     className="btn btn-quiet"
//                                     onClick={() => setShowForm(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="btn btn-primary"
//                                     type="submit"
//                                 >
//                                     Save beneficiary
//                                 </button>
//                             </div>

//                             <p className="form-small-note">
//                                 Demo only: this form does not save to the API.
//                             </p>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from 'react';
import {
    Building2,
    Plus,
    Search,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import type { Beneficiary } from '../../types';

const API_URL = 'https://localhost:53273/api/beneficiaries';

interface ApiBeneficiary {
    id: string;
    ownerUserId: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    bankCode: string;
    branchName: string;
    createdAt: string;
}

interface CreateBeneficiaryRequest {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    bankCode: string;
    branchName: string;
    currency: string;
}

interface BeneficiaryForm {
    name: string;
    account: string;
    bank: string;
    country: string;
}

const EMPTY_FORM: BeneficiaryForm = {
    name: '',
    account: '',
    bank: '',
    country: 'Nepal',
};

function mapBeneficiary(b: ApiBeneficiary): Beneficiary {
    return {
        id: b.id,
        accountName: b.accountHolderName,
        accountNumber: `•••• ${b.accountNumber.slice(-4)}`,
        bankName: b.bankName,
        country: b.bankCountry,
        currency: b.bankCountry === 'Nepal' ? 'NPR' : 'USD',
    };
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('remitly_token');

    return {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function apiRequest<T>(
    url: string,
    options: RequestInit = {},
): Promise<T | undefined> {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const body = await response.text();

    if (!response.ok) {
        let message = body;

        try {
            const parsed = JSON.parse(body);
            message =
                parsed.detail ??
                parsed.title ??
                parsed.message ??
                parsed.errors
                    ? JSON.stringify(parsed.errors ?? parsed)
                    : message;
        } catch {
            // The response was plain text rather than JSON.
        }

        throw new Error(
            message || `Request failed with status ${response.status}`,
        );
    }

    if (!body) return undefined;

    return JSON.parse(body) as T;
}

export default function BeneficiariesPage() {
    const [items, setItems] = useState<Beneficiary[]>([]);
    const [query, setQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<BeneficiaryForm>(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const loadBeneficiaries = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError('');

            const data = await apiRequest<ApiBeneficiary[]>(API_URL, {
                method: 'GET',
                signal,
            });

            setItems((data ?? []).map(mapBeneficiary));
        } catch (err) {
            if (
                err instanceof Error &&
                (err.name === 'AbortError' || signal?.aborted)
            ) {
                return;
            }

            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to load beneficiaries.',
            );
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        void loadBeneficiaries(controller.signal);

        return () => controller.abort();
    }, [loadBeneficiaries]);

    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) return items;

        return items.filter(item =>
            `${item.accountName} ${item.bankName} ${item.country}`
                .toLowerCase()
                .includes(search),
        );
    }, [items, query]);

    function updateForm<K extends keyof BeneficiaryForm>(
        field: K,
        value: BeneficiaryForm[K],
    ) {
        setForm(current => ({ ...current, [field]: value }));
    }

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (saving) return;

        setSaving(true);
        setError('');
        setSuccess('');

        const payload: CreateBeneficiaryRequest = {
            accountName: form.name.trim(),
            accountNumber: form.account.trim(),
            bankName: form.bank.trim(),
            bankCountry: form.country,
            bankCode: '',
            branchName: '',
            currency: form.country === 'Nepal' ? 'NPR' : 'USD',
        };

        try {
            const saved = await apiRequest<ApiBeneficiary>(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (saved?.id) {
                setItems(current => [...current, mapBeneficiary(saved)]);
            } else {
                // Supports APIs that return 204 or no response body.
                await loadBeneficiaries();
            }

            setForm(EMPTY_FORM);
            setShowForm(false);
            setSuccess('Beneficiary saved successfully.');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to save beneficiary.',
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteBeneficiary(beneficiary: Beneficiary) {
        if (deletingId) return;

        const confirmed = window.confirm(
            `Are you sure you want to remove ${beneficiary.accountName}?`,
        );

        if (!confirmed) return;

        setDeletingId(beneficiary.id);
        setError('');
        setSuccess('');

        try {
            await apiRequest<void>(
                `${API_URL}/${encodeURIComponent(beneficiary.id)}`,
                { method: 'DELETE' },
            );

            setItems(current =>
                current.filter(item => item.id !== beneficiary.id),
            );

            setSuccess('Beneficiary deleted successfully.');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to delete beneficiary.',
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <>
            <PageHeader
                eyebrow="YOUR PEOPLE, ONE PLACE"
                title="Beneficiaries"
                description="Manage the recipients you may want to send money to."
                action={
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setError('');
                            setShowForm(true);
                        }}
                    >
                        <Plus size={16} /> Add beneficiary
                    </button>
                }
            />

            {success && (
                <div className="inline-success" role="status">
                    <span>✓</span> {success}
                </div>
            )}

            {error && (
                <div className="inline-error" role="alert">
                    {error}
                    <button
                        className="btn btn-quiet"
                        onClick={() => void loadBeneficiaries()}
                        disabled={loading}
                    >
                        Retry loading
                    </button>
                </div>
            )}

            <div className="summary-strip">
                <div>
                    <span className="summary-icon">
                        <UserRound size={18} />
                    </span>
                    <div>
                        <strong>{items.length} saved recipients</strong>
                        <p>Your beneficiary list</p>
                    </div>
                </div>

                <div className="search-wrap">
                    <Search size={17} />
                    <input
                        aria-label="Search beneficiaries"
                        placeholder="Search recipients or banks"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Loading beneficiaries...</p>
                </div>
            ) : (
                <div className="beneficiary-grid">
                    {filtered.map((b, i) => (
                        <article className="beneficiary-card" key={b.id}>
                            <div className="beneficiary-card-top">
                                <span
                                    className={`beneficiary-avatar bcolor-${i % 3}`}
                                >
                                    {(b.accountName || '').trim()
                                        .split(/\s+/)
                                        .map(part => part[0])
                                        .join('')
                                        .toUpperCase()}
                                </span>

                                <button
                                    className="icon-button small-icon"
                                    aria-label={`Remove ${b.accountName}`}
                                    title="Delete beneficiary"
                                    disabled={deletingId !== null}
                                    onClick={() =>
                                        void deleteBeneficiary(b)
                                    }
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h3>{b.accountName}</h3>

                            <p className="beneficiary-country">
                                {b.country} <span>·</span> {b.currency}
                            </p>

                            <div className="beneficiary-detail">
                                <span>
                                    <Building2 size={15} /> Bank
                                </span>
                                <strong>{b.bankName}</strong>
                            </div>

                            <div className="beneficiary-detail">
                                <span>Account number</span>
                                <strong className="mono">
                                    {b.accountNumber}
                                </strong>
                            </div>

                            <div className="beneficiary-card-footer">
                                <span className="verified-mini">
                                    ✓ Saved recipient
                                </span>
                                <span>•••</span>
                            </div>
                        </article>
                    ))}

                    {!filtered.length && (
                        <div className="empty-state">
                            <UserRound size={30} />
                            <h3>No recipients found</h3>
                            <p>
                                {query
                                    ? 'Try a different search.'
                                    : 'Add a beneficiary to get started.'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <div
                    className="modal-backdrop"
                    onClick={() => {
                        if (!saving) setShowForm(false);
                    }}
                >
                    <div
                        className="modal-card"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-heading">
                            <div>
                                <h3>Add beneficiary</h3>
                                <p>
                                    Add the bank details of your recipient.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => setShowForm(false)}
                                aria-label="Close"
                                disabled={saving}
                            >
                                <X />
                            </button>
                        </div>

                        <form className="modal-form" onSubmit={submit}>
                            <div className="field-group">
                                <label htmlFor="benName">
                                    Account holder name
                                </label>
                                <input
                                    id="benName"
                                    value={form.name}
                                    onChange={e =>
                                        updateForm('name', e.target.value)
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Full name as on bank account"
                                />
                            </div>

                            <div className="field-group">
                                <label htmlFor="benCountry">
                                    Recipient country
                                </label>
                                <select
                                    id="benCountry"
                                    value={form.country}
                                    onChange={e =>
                                        updateForm('country', e.target.value)
                                    }
                                >
                                    <option>Nepal</option>
                                    <option>India</option>
                                    <option>United Kingdom</option>
                                    <option>United States</option>
                                    <option>Australia</option>
                                </select>
                            </div>

                            <div className="field-group">
                                <label htmlFor="benBank">Bank name</label>
                                <input
                                    id="benBank"
                                    value={form.bank}
                                    onChange={e =>
                                        updateForm('bank', e.target.value)
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Recipient's bank"
                                />
                            </div>

                            <div className="field-group">
                                <label htmlFor="benAccount">
                                    Bank account number
                                </label>
                                <input
                                    id="benAccount"
                                    value={form.account}
                                    onChange={e =>
                                        updateForm('account', e.target.value)
                                    }
                                    required
                                    minLength={4}
                                    maxLength={50}
                                    autoComplete="off"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-quiet"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : 'Save beneficiary'}
                                </button>
                            </div>

                            <p className="form-small-note">
                                Beneficiary details are saved through your
                                account's API.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}