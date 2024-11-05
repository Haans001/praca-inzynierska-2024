export {};

declare global {
  interface CustomJwtSessionClaims {
    databaseID: number;
    role: 'USER' | 'ADMIN';
    email: string;
    clerkID: string;
  }
  interface UserPublicMetadata {
    databaseID: number;
    role: 'USER' | 'ADMIN';
  }
}
