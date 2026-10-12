import type { Status } from '../../types';
export default function StatusBadge({ status }: { status: Status | 'Not submitted' }) { const cls = status.toLowerCase().replace(/\s+/g, '-'); return <span className={`status-badge status-${cls}`}><i/>{status}</span>; }
