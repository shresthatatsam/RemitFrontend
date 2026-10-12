export type UserRole = 'User' | 'Admin';
export interface User { id: string; email: string; fullName?: string; role: UserRole; emailConfirmed?: boolean; }
export interface Beneficiary { id: string; accountName: string; accountNumber: string; bankName: string; country: string; currency: string; }
export type Status = 'Completed' | 'Pending' | 'In review' | 'Rejected' | 'Action required';
export interface Transfer { id: string; reference: string; beneficiary: string; country: string; amount: number; currency: string; status: Status; date: string; }
export interface Deposit { id: string; reference: string; amount: number; currency: string; date: string; status: Status; method: string; }
export interface KycProfile { fullName: string; dateOfBirth: string; nationality: string; documentType: string; documentNumber: string; address: string; status: Status | 'Not submitted'; }
