export interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}
