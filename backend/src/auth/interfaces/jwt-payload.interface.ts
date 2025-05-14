export interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  display_name: string;
}
