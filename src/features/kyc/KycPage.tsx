import { useEffect, useState, type FormEvent } from 'react';
import {
    CheckCircle2,
    FileCheck2,
    ShieldCheck,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';

const KYC_API_URL = 'https://localhost:53273/api/kyc';
const KYC_ME_URL = `${KYC_API_URL}/me`;
const TOKEN_KEY = 'remitly_token';

type KycStatus =
    | 'Not submitted'
    | 'In review'
    | 'Approved'
    | 'Rejected';

    

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
}

const STATUS_MAP: Record<number, KycStatus> = {
    0: 'In review', // Pending
    1: 'In review', // UnderReview
    2: 'Approved',
    3: 'Rejected',
    4: 'Rejected', // ActionRequired
};

function getKycStatus(status: number | string | undefined): KycStatus {
    if (typeof status === 'number') {
        return STATUS_MAP[status] ?? 'Not submitted';
    }

    if (typeof status === 'string') {
        const normalized = status.trim().toLowerCase();

        switch (normalized) {
            case '0':
            case 'pending':
            case '1':
            case 'underreview':
            case 'under review':
            case 'inreview':
            case 'in review':
                return 'In review';

            case '2':
            case 'approved':
                return 'Approved';

            case '3':
            case 'rejected':
            case '4':
            case 'actionrequired':
            case 'action required':
                return 'Rejected';

            default:
                return 'Not submitted';
        }
    }

    return 'Not submitted';
}

export default function KycPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [kycStatus, setKycStatus] =
        useState<KycStatus>('Not submitted');
    const [error, setError] = useState('');
    const [reviewNotes, setReviewNotes] = useState('');

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('Nepal');
    const [documentType, setDocumentType] = useState('Passport');
    const [documentNumber, setDocumentNumber] = useState('');
    const [address, setAddress] = useState('');
    const [documentFrontUrl, setDocumentFrontUrl] = useState('');
    const [documentBackUrl, setDocumentBackUrl] = useState('');
    const [selfieUrl, setSelfieUrl] = useState('');

    // Load the current user's KYC record.
    useEffect(() => {
        const controller = new AbortController();

        async function loadKycStatus() {
            try {
                setCheckingStatus(true);
                setError('');

                const token = localStorage.getItem(TOKEN_KEY);

                if (!token) {
                    setKycStatus('Not submitted');
                    setSubmitted(false);
                    return;
                }

                const response = await fetch(KYC_ME_URL, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                // No existing KYC record.
                if (response.status === 404) {
                    setKycStatus('Not submitted');
                    setSubmitted(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        `Unable to load KYC status (${response.status}).`
                    );
                }

                const data: KycResponse = await response.json();

                const status = getKycStatus(data.status);

                setKycStatus(status);
                setSubmitted(true);
                setReviewNotes(data.adminNote ?? '');

                // Populate existing KYC fields.
                setName(data.fullName ?? '');
                setDob(data.dateOfBirth?.slice(0, 10) ?? '');
                setNationality(data.nationality ?? 'Nepal');
                setDocumentType(data.documentType ?? 'Passport');
                setDocumentNumber(data.documentNumber ?? '');
                setAddress(data.address ?? '');
                setDocumentFrontUrl(data.documentFrontUrl ?? '');
                setDocumentBackUrl(data.documentBackUrl ?? '');
                setSelfieUrl(data.selfieUrl ?? '');
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Unable to check your KYC status.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setCheckingStatus(false);
                }
            }
        }

        void loadKycStatus();

        return () => controller.abort();
    }, []);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                throw new Error(
                    'Please log in before submitting your KYC details.'
                );
            }

            const payload = {
                fullName: name.trim(),
                dateOfBirth: dob,
                nationality: nationality.trim(),
                documentType,
                documentNumber: documentNumber.trim(),
                documentFrontUrl: documentFrontUrl.trim() || null,
                documentBackUrl: documentBackUrl.trim() || null,
                selfieUrl: selfieUrl.trim() || null,
                address: address.trim() || null,
            };

            const response = await fetch(KYC_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || `KYC submission failed (${response.status}).`
                );
            }

            setSubmitted(true);
            setKycStatus('In review');
            setReviewNotes('');
            
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to submit KYC. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    const isLocked = submitted || checkingStatus || loading;

    const reviewActive = [
        'In review',
        'Approved',
        'Rejected',
    ].includes(kycStatus);

    const statusTitle: Record<KycStatus, string> = {
        'Not submitted': 'Verify your identity',
        'In review': 'Your details are submitted',
        Approved: 'Your identity is verified',
        Rejected: 'Verification rejected',
    };

    const statusDescription: Record<KycStatus, string> = {
        'Not submitted':
            'Have a valid identity document ready. Our review team will check the information you provide.',
        'In review':
            'Your information is being reviewed by our team.',
        Approved:
            'Your identity has been verified successfully.',
        Rejected:
            reviewNotes ||
            'Your verification was rejected. Please contact support for next steps.',
    };

    return (
        <>
            <PageHeader
                eyebrow="ACCOUNT PROTECTION"
                title="Identity verification"
                description="Confirm your identity to help protect your account and enable transfer requests."
            />

            <div className="content-narrow">
                <div className="kyc-status-card">
                    <div className="kyc-status-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div className="kyc-status-copy">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'wrap',
                                marginBottom: '8px',
                            }}
                        >
                            <span style={{ fontSize: '0.85rem', opacity: 0.75 }}>
                                Current KYC status:
                            </span>
                            <strong
                                aria-live="polite"
                                style={{
                                    fontWeight: 700,
                                    color: checkingStatus
                                        ? 'inherit'
                                        : kycStatus === 'Approved'
                                          ? '#15803d'
                                          : kycStatus === 'In review'
                                            ? '#b45309'
                                            : kycStatus === 'Rejected'
                                              ? '#b91c1c'
                                              : 'inherit',
                                }}
                            >
                                {checkingStatus ? 'Checking...' : kycStatus}
                            </strong>
                        </div>
                        <strong>
                            {checkingStatus
                                ? 'Checking your verification status...'
                                : statusTitle[kycStatus]}
                        </strong>

                        <p>
                            {checkingStatus
                                ? 'Please wait while we retrieve your KYC details.'
                                : statusDescription[kycStatus]}
                        </p>
                    </div>

                    <StatusBadge
                        status={
                            checkingStatus
                                ? 'Not submitted'
                                : kycStatus
                        }
                    />
                </div>

                <div className="step-progress">
                    <div
                        className={`step-progress-item ${
                            kycStatus !== 'Not submitted' ? 'active' : 'active'
                        }`}
                    >
                        <span>1</span>

                        <div>
                            <strong>Your details</strong>
                            <small>Personal information</small>
                        </div>
                    </div>

                    <div className="step-progress-line" />

                    <div
                        className={`step-progress-item ${
                            reviewActive ? 'active' : ''
                        }`}
                    >
                        <span>
                            {kycStatus === 'Approved' ? '✓' : '2'}
                        </span>

                        <div>
                            <strong>Review</strong>
                            <small>
                                {kycStatus === 'Approved'
                                    ? 'Verification complete'
                                    : kycStatus === 'Rejected'
                                      ? 'Action required'
                                      : kycStatus === 'In review'
                                        ? 'Under review'
                                        : 'Verification check'}
                            </small>
                        </div>
                    </div>
                </div>

                <form className="panel form-panel" onSubmit={submit}>
                    <div className="panel-heading">
                        <div>
                            <h3>Personal information</h3>
                            <p>
                                Enter your details exactly as they appear
                                on your ID.
                            </p>
                        </div>

                        <FileCheck2
                            size={22}
                            className="panel-heading-icon"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="field-group full">
                            <label htmlFor="kycName">
                                Full legal name
                            </label>

                            <input
                                id="kycName"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="As shown on your identity document"
                                required
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="dob">Date of birth</label>

                            <input
                                id="dob"
                                type="date"
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                required
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="nationality">
                                Country of residence
                            </label>

                            <select
                                id="nationality"
                                value={nationality}
                                onChange={e =>
                                    setNationality(e.target.value)
                                }
                                disabled={isLocked}
                            >
                                <option value="Nepal">Nepal</option>
                                <option value="India">India</option>
                                <option value="United Kingdom">
                                    United Kingdom
                                </option>
                                <option value="United States">
                                    United States
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="documentType">
                                Identity document
                            </label>

                            <select
                                id="documentType"
                                value={documentType}
                                onChange={e =>
                                    setDocumentType(e.target.value)
                                }
                                disabled={isLocked}
                            >
                                <option value="Passport">Passport</option>
                                <option value="National ID">National ID</option>
                                <option value="Driving licence">
                                    Driving licence
                                </option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="documentNumber">
                                Document number
                            </label>

                            <input
                                id="documentNumber"
                                value={documentNumber}
                                onChange={e =>
                                    setDocumentNumber(e.target.value)
                                }
                                placeholder="Enter document number"
                                required
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group full">
                            <label htmlFor="address">
                                Residential address
                            </label>

                            <textarea
                                id="address"
                                rows={3}
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Street, city, postal code, country"
                                required
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group full">
                            <label htmlFor="documentFrontUrl">Front of identity document URL</label>
                            <input
                                id="documentFrontUrl"
                                type="url"
                                value={documentFrontUrl}
                                onChange={e => setDocumentFrontUrl(e.target.value)}
                                placeholder="Private storage URL for the front of your ID"
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group full">
                            <label htmlFor="documentBackUrl">Back of identity document URL</label>
                            <input
                                id="documentBackUrl"
                                type="url"
                                value={documentBackUrl}
                                onChange={e => setDocumentBackUrl(e.target.value)}
                                placeholder="Private storage URL for the back of your ID"
                                disabled={isLocked}
                            />
                        </div>

                        <div className="field-group full">
                            <label htmlFor="selfieUrl">Selfie URL</label>
                            <input
                                id="selfieUrl"
                                type="url"
                                value={selfieUrl}
                                onChange={e => setSelfieUrl(e.target.value)}
                                placeholder="Private storage URL for your selfie"
                                disabled={isLocked}
                            />
                        </div>

                    </div>

                    <div className="form-footer">
                        <p>
                            <ShieldCheck size={15} />
                            Submit your information through a secure service.
                        </p>

                        {kycStatus === 'Rejected' && submitted && (
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {
                                    setSubmitted(false);
                                    setKycStatus('Not submitted');
                                    setError('');
                                }}
                                disabled={checkingStatus || loading}
                            >
                                Edit details
                            </button>
                        )}

                        {kycStatus !== 'Approved' &&
                            !(kycStatus === 'Rejected' && submitted) && (
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isLocked}
                                >
                                    {checkingStatus
                                        ? 'Checking status...'
                                        : loading
                                          ? 'Submitting...'
                                          : submitted
                                            ? 'Submitted for review'
                                            : 'Submit for verification'}

                                    {!loading && !checkingStatus && !submitted && (
                                        <span>→</span>
                                    )}
                                </button>
                            )}
                    </div>

                    {error && (
                        <div className="inline-error" role="alert">
                            {error}
                        </div>
                    )}

                    {submitted && kycStatus === 'In review' && (
                        <div className="inline-success">
                            <CheckCircle2 size={17} />
                            Your KYC details are awaiting review.
                        </div>
                    )}

                    {kycStatus === 'Approved' && (
                        <div className="inline-success">
                            <CheckCircle2 size={17} />
                            Your identity verification is complete.
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}