export interface AuthenticatedUser {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  city: string | null;
  district: string | null;
}
