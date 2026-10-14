import type { Status as AppStatus } from '../../types';

export type Status =
    | AppStatus
    | 'Active'
    | 'Not submitted'
    | 'Checking...'
    | 'UnderReview'
    | 'Under Review'
    | 'Approved'
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
    Completed: 'status-approved',
    'Not submitted': 'status-not-submitted',
    'In review': 'status-in-review',
    Approved: 'status-approved',
    Rejected: 'status-rejected',
    'Action required': 'status-rejected',
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