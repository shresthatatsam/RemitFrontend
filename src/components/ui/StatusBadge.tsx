// import type { Status } from '../../types';
// export default function StatusBadge({ status }: { status: Status | 'Not submitted' }) { const cls = status.toLowerCase().replace(/\s+/g, '-'); return <span className={`status-badge status-${cls}`}><i/>{status}</span>; }
import type { ReactNode } from 'react';

export type Status =
    | 'Pending'
    | 'Active'
    | 'Completed'
    | 'Not submitted'
    | 'In review'
    | 'Approved'
    | 'Rejected'
    | 'Checking...'
    | 'UnderReview'
    | 'Under Review'
    | 'Failed'
    | 'Success'
    | 'Processing'
    | 'Cancelled'
    | 'Inactive';

interface StatusBadgeProps {
    status: Status;
}

const STATUS_STYLES: Record<Status, string> = {
    Pending: 'status-pending',
    Active: 'status-active',
    Completed: 'status-completed',
    'Not submitted': 'status-not-submitted',
    'In review': 'status-in-review',
    Approved: 'status-approved',
    Rejected: 'status-rejected',
    'Checking...': 'status-checking',
    UnderReview: 'status-in-review',
    'Under Review': 'status-in-review',
    Failed: 'status-rejected',
    Success: 'status-approved',
    Processing: 'status-pending',
    Cancelled: 'status-rejected',
    Inactive: 'status-not-submitted',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const className = STATUS_STYLES[status] ?? 'status-not-submitted';

    return (
        <span className={`status-badge ${className}`}>
            {status}
        </span>
    );
}