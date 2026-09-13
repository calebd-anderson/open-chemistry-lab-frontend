export interface User {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string;
  lastLoginDate: Date | null;
  joinDate: Date | null;
  role: string;
  authorities: string[];
  active: boolean;
  notLocked: boolean;
  highScore: number;
}
