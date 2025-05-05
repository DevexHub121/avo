export const ROLES = {
    ADMIN: 'business-admin',
    USER: 'user',
} as const;
export type Role = typeof ROLES[keyof typeof ROLES];
