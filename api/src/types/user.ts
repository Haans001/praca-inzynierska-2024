export type User = {
  databaseID: number;
  clerkID: string;
  email: string;
  role: 'USER' | 'ADMIN';
};
