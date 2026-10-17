import { useEffect, useState, type FormEvent } from 'react';
import {
    CheckCircle2,
    FileCheck2,
    ShieldCheck,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';

const KYC_API_URL = import.meta.env.VITE_API_URL || 'https://localhost:53273/api/kyc';
const KYC_ME_URL = `${KYC_API_URL}/me`;
type KycStatus = 'Not submitted' | 'In review' | 'Approved' | 'Rejected';

interface KycResponse {
    id?: string;
    userId?: string;
    fullName?: string;
    dateOfBirth?: string;
    nationality?: string;
    documentType?: string;
    documentNumber?: string;
    documentFrontUrl?: string | null;
    documentBackUrl?: string | null;
    selfieUrl?: string | null;
    address?: string | null;
    status?: number | string;
    adminNote?: string | null;
    reviewedAtUtc?: string | null;
    currentStep?: number;
}

const STATUS_MAP: Record<number, KycStatus> = {
    0: 'Not submitted',
    1: 'In review',
    2: 'In review',
    3: 'Approved',
    4: 'Rejected',
    5: 'Rejected',
};

function getKycStatus(status: number | string | undefined): KycStatus {
    if (typeof status === 'number') return STATUS_MAP[status] ?? 'Not submitted';
    if (typeof status === 'string') {
        const n = status.trim().toLowerCase();
        switch (n) {
            case '0': case 'draft': return 'Not submitted';
            case '1': case 'pending': return 'In review';
            case '2': case 'underreview': case 'under review': return 'In review';
            case '3': case 'approved': return 'Approved';
            case '4': case 'rejected': return 'Rejected';
            case '5': case 'actionrequired': case 'action required': return 'Rejected';
            default: return 'Not submitted';
        }
    }
    return 'Not submitted';
}

export default function KycPage() {
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [kycStatus, setKycStatus] = useState<KycStatus>('Not submitted');
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');
    const [reviewNotes, setReviewNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('Nepal');
    const [documentType, setDocumentType] = useState('Passport');
    const [documentNumber, setDocumentNumber] = useState('');
    const [address, setAddress] = useState('');
    const [documentFrontFile, setDocumentFrontFile] = useState<File | null>(null);
    const [documentBackFile, setDocumentBackFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function loadKycStatus() {
            try {
                setCheckingStatus(true);
                setError('');
                const token = localStorage.getItem('remitly_token');
                if (!token) {
                    setKycStatus('Not submitted');
                    setCurrentStep(1);
                    setSubmitted(false);
                    return;
                }
                const response = await fetch(KYC_ME_URL, {
                    method: 'GET',
                    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                });
                if (response.status === 404) {
                    setKycStatus('Not submitted');
                    setCurrentStep(1);
                    setSubmitted(false);
                    return;
                }
                if (!response.ok) throw new Error(`Unable to load KYC status (${response.status}).`);
                const data: KycResponse = await response.json();
                const status = getKycStatus(data.status);
                setKycStatus(status);
                setReviewNotes(data.adminNote ?? '');
                setCurrentStep(data.currentStep ?? 1);
                setSubmitted(status !== 'Not submitted');
                setName(data.fullName ?? '');
                setDob(data.dateOfBirth?.slice(0, 10) ?? '');
                setNationality(data.nationality ?? 'Nepal');
                setDocumentType(data.documentType ?? 'Passport');
                setDocumentNumber(data.documentNumber ?? '');
                setAddress(data.address ?? '');
                // setDocumentFrontUrl('');
                // setDocumentBackUrl('');
                // setSelfieUrl('');
                setDocumentFrontFile(null);
                setDocumentBackFile(null);
                setSelfieFile(null);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                setError(err instanceof Error ? err.message : 'Unable to check your KYC status.');
            } finally {
                if (!controller.signal.aborted) setCheckingStatus(false);
            }
        }
        void loadKycStatus();
        return () => controller.abort();
    }, []);

    const isLocked = submitted || checkingStatus || loading || kycStatus === 'Approved' || kycStatus === 'Rejected';
    const reviewActive = ['In review', 'Approved', 'Rejected'].includes(kycStatus);

    const statusTitle: Record<KycStatus, string> = {
        'Not submitted': 'Verify your identity',
        'In review': 'Your details are submitted',
        Approved: 'Your identity is verified',
        Rejected: 'Verification rejected',
    };
    const statusDescription: Record<KycStatus, string> = {
        'Not submitted': 'Complete the steps below to verify your identity.',
        'In review': 'Your information is being reviewed by our team.',
        Approved: 'Your identity has been verified successfully.',
        Rejected: reviewNotes || 'Your verification was rejected. Please contact support for next steps.',
    };

    async function savePersonal(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('remitly_token');
            if (!token) throw new Error('Please log in before submitting.');
            const payload = { fullName: name.trim(), dateOfBirth: dob, nationality: nationality.trim(), address: address.trim() || null };
            const res = await fetch(`${KYC_API_URL}/steps/personal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const msg = await res.text(); throw new Error(msg || `Failed (${res.status})`); }
            setCurrentStep(2);
        } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save personal info.'); }
        finally { setLoading(false); }
    }

    async function saveDocument(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const token = localStorage.getItem('remitly_token');
        if (!token) throw new Error('Please log in.');

        if (!documentNumber.trim()) {
            throw new Error('Please enter your document number.');
        }

        if (!documentFrontFile) {
            throw new Error('Please select the front of your identity document.');
        }

        const formData = new FormData();

        formData.append('DocumentType', documentType.trim());
        formData.append('DocumentNumber', documentNumber.trim());
        formData.append('DocumentFront', documentFrontFile);

        if (documentBackFile) {
            formData.append('DocumentBack', documentBackFile);
        }

        const res = await fetch(`${KYC_API_URL}/steps/document`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: formData,
        });

        if (!res.ok) {
            const body = await res.text();
            throw new Error(body || `Failed to save document (${res.status})`);
        }

        setCurrentStep(3);
    } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : 'Failed to save identity document.',
        );
    } finally {
        setLoading(false);
    }
}

    async function saveSelfie(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('remitly_token');
            if (!token) throw new Error('Please log in.');
            const formData = new FormData();
            if (selfieFile) formData.append('Selfie', selfieFile);
            const res = await fetch(`${KYC_API_URL}/steps/selfie`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) { const msg = await res.text(); throw new Error(msg || `Failed (${res.status})`); }
            setCurrentStep(4);
        } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save selfie.'); }
        finally { setLoading(false); }
    }

    async function submitKyc(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('remitly_token');
            if (!token) throw new Error('Please log in.');
            const res = await fetch(`${KYC_API_URL}/submit`, {
                method: 'POST',
                headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!res.ok) { const msg = await res.text(); throw new Error(msg || `Failed (${res.status})`); }
            setSubmitted(true);
            setKycStatus('In review');
            setReviewNotes('');
        } catch (err) { setError(err instanceof Error ? err.message : 'Submission failed.'); }
        finally { setLoading(false); }
    }

    return (
        <>
            <PageHeader eyebrow="ACCOUNT PROTECTION" title="Identity verification" description="Confirm your identity to help protect your account and enable transfer requests." />
            <div className="content-narrow">
                <div className="kyc-status-card">
                    <div className="kyc-status-icon"><ShieldCheck size={24} /></div>
                    <div className="kyc-status-copy">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem', opacity: 0.75 }}>Current KYC status:</span>
                            <strong aria-live="polite" style={{ fontWeight: 700, color: checkingStatus ? 'inherit' : kycStatus === 'Approved' ? '#15803d' : kycStatus === 'In review' ? '#b45309' : kycStatus === 'Rejected' ? '#b91c1c' : 'inherit' }}>
                                {checkingStatus ? 'Checking...' : kycStatus}
                            </strong>
                        </div>
                        <strong>{checkingStatus ? 'Checking your verification status...' : statusTitle[kycStatus]}</strong>
                        <p>{checkingStatus ? 'Please wait while we retrieve your KYC details.' : statusDescription[kycStatus]}</p>
                    </div>
                    <StatusBadge status={checkingStatus ? 'Not submitted' : kycStatus} />
                </div>

                <div className="step-progress">
                    <div className={`step-progress-item ${currentStep >= 1 ? 'active' : ''}`}>
                        <span>1</span>
                        <div><strong>Personal info</strong><small>Step 1</small></div>
                    </div>
                    <div className="step-progress-line" />
                    <div className={`step-progress-item ${currentStep >= 2 ? 'active' : ''}`}>
                        <span>2</span>
                        <div><strong>Document</strong><small>Step 2</small></div>
                    </div>
                    <div className="step-progress-line" />
                    <div className={`step-progress-item ${currentStep >= 3 ? 'active' : ''}`}>
                        <span>3</span>
                        <div><strong>Selfie</strong><small>Step 3</small></div>
                    </div>
                    <div className="step-progress-line" />
                    <div className={`step-progress-item ${currentStep >= 4 ? 'active' : ''}`}>
                        <span>{kycStatus === 'Approved' ? '✓' : '4'}</span>
                        <div><strong>Review</strong><small>Step 4</small></div>
                    </div>
                </div>

                <form className="panel form-panel" onSubmit={savePersonal}>
                    <div className="panel-heading">
                        <div><h3>Step 1 — Personal information</h3><p>Enter your details exactly as they appear on your identity document.</p></div>
                        <FileCheck2 size={22} className="panel-heading-icon" />
                    </div>
                    <div className="form-grid">
                        <div className="field-group full">
                            <label htmlFor="kycName">Full legal name</label>
                            <input id="kycName" value={name} onChange={e => setName(e.target.value)} placeholder="As shown on your identity document" required disabled={isLocked || currentStep > 1} />
                        </div>
                        <div className="field-group">
                            <label htmlFor="dob">Date of birth</label>
                            <input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} required disabled={isLocked || currentStep > 1} />
                        </div>
                        <div className="field-group">
                            <label htmlFor="nationality">Nationality</label>
                            <select id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} disabled={isLocked || currentStep > 1}>
                                <option value="Nepal">Nepal</option>
                                <option value="India">India</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="field-group full">
                            <label htmlFor="address">Residential address</label>
                            <textarea id="address" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, city, postal code, country" disabled={isLocked || currentStep > 1} />
                        </div>
                    </div>
                    <div className="form-footer">
                        {currentStep === 1 && <button className="btn btn-primary" type="submit" disabled={isLocked || loading}>{loading ? 'Saving...' : 'Continue to document →'}</button>}
                    </div>
                </form>

                <form className="panel form-panel" onSubmit={saveDocument}>
                    <div className="panel-heading">
                        <div><h3>Step 2 — Identity document</h3><p>Upload URLs for your identity document.</p></div>
                        <FileCheck2 size={22} className="panel-heading-icon" />
                    </div>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="documentType">Document type</label>
                            <select id="documentType" value={documentType} onChange={e => setDocumentType(e.target.value)} disabled={isLocked || currentStep < 2 || currentStep > 2}>
                                <option value="Passport">Passport</option>
                                <option value="National ID">National ID</option>
                                <option value="Driving licence">Driving licence</option>
                            </select>
                        </div>
                        <div className="field-group">
                            <label htmlFor="documentNumber">Document number</label>
                            <input id="documentNumber" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} placeholder="Enter document number" disabled={isLocked || currentStep < 2 || currentStep > 2} />
                        </div>
                        <div className="field-group full">
                            <label htmlFor="documentFrontFile">Front of identity document</label>
                            <input id="documentFrontFile" type="file" accept="image/*,.pdf" onChange={e => setDocumentFrontFile(e.target.files?.[0] ?? null)} disabled={isLocked || currentStep < 2 || currentStep > 2} />
                        </div>
                        <div className="field-group full">
                            <label htmlFor="documentBackFile">Back of identity document (optional)</label>
                            <input id="documentBackFile" type="file" accept="image/*,.pdf" onChange={e => setDocumentBackFile(e.target.files?.[0] ?? null)} disabled={isLocked || currentStep < 2 || currentStep > 2} />
                        </div>
                    </div>
                    <div className="form-footer">
                        {currentStep === 2 && <button className="btn btn-primary" type="submit" disabled={isLocked || loading}>{loading ? 'Saving...' : 'Continue to selfie →'}</button>}
                    </div>
                </form>

                <form className="panel form-panel" onSubmit={saveSelfie}>
                    <div className="panel-heading">
                        <div><h3>Step 3 — Selfie photo</h3><p>Provide a URL to your selfie photo.</p></div>
                        <FileCheck2 size={22} className="panel-heading-icon" />
                    </div>
                    <div className="form-grid">
                        <div className="field-group full">
                            <label htmlFor="selfieFile">Selfie photo</label>
                            <input id="selfieFile" type="file" accept="image/*" onChange={e => setSelfieFile(e.target.files?.[0] ?? null)} disabled={isLocked || currentStep < 3 || currentStep > 3} />
                        </div>
                    </div>
                    <div className="form-footer">
                        {currentStep === 3 && <button className="btn btn-primary" type="submit" disabled={isLocked || loading}>{loading ? 'Saving...' : 'Continue to review →'}</button>}
                    </div>
                </form>

                <form className="panel form-panel" onSubmit={submitKyc}>
                    <div className="panel-heading">
                        <div><h3>Step 4 — Final submission</h3><p>Review your information and submit for verification.</p></div>
                        <ShieldCheck size={22} className="panel-heading-icon" />
                    </div>
                    <div className="form-grid">
                        <div className="field-group full">
                            <p><strong>Full name:</strong> {name}</p>
                            <p><strong>Date of birth:</strong> {dob}</p>
                            <p><strong>Nationality:</strong> {nationality}</p>
                            <p><strong>Document:</strong> {documentType} — {documentNumber}</p>
                            <p><strong>Address:</strong> {address}</p>
                        </div>
                    </div>
                    <div className="form-footer">
                        {currentStep >= 4 && kycStatus !== 'Approved' && kycStatus !== 'Rejected' && (
                            <button className="btn btn-primary" type="submit" disabled={isLocked || loading || submitted}>
                                {loading ? 'Submitting...' : submitted ? 'Submitted for review' : 'Submit for verification'}
                            </button>
                        )}
                        {kycStatus === 'Rejected' && submitted && (
                            <button className="btn btn-primary" type="button" onClick={() => { setSubmitted(false); setKycStatus('Not submitted'); setCurrentStep(1); setError(''); }} disabled={loading}>Edit details</button>
                        )}
                    </div>
                </form>

                {error && <div className="inline-error" role="alert">{error}</div>}
                {submitted && kycStatus === 'In review' && <div className="inline-success"><CheckCircle2 size={17} /> Your KYC details are awaiting review.</div>}
                {kycStatus === 'Approved' && <div className="inline-success"><CheckCircle2 size={17} /> Your identity verification is complete.</div>}
            </div>
        </>
    );
}
