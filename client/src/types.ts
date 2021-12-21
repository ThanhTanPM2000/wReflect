export type Teams = {
  data: [Team];
  total: number;
};

export type Team = {
  id: string;
  name: string;
  ownerEmail: string[];
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  picture: string;
  numOfMember: number;
  isPublic: boolean;
  description: string | null;
  status: TeamStatus;
  members: [Member];
};

export type Member = {
  id: string;
  userId: string;
  teamId: string;
  isOwner: boolean;
  isPendingInvitation: boolean;
  isGuess: boolean;
  invitedBy: string | null;
  joinedAt: Date;
  role: string | null;
  user: User;
  team: Team;
};

export type UserProfile = {
  id: string;
  userId: string;
  name: string;
  nickname: string;
  picture: string;
  workplace: string | null;
  address: string | null;
  school: string | null;
  introduction: string | null;
  talents: string | null;
  interests: string | null;
  createdAt: Date;
  updatedAt: Date;
  gender: Gender;
  user: User;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  data: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MemberStatus = 'PENDING_INVITATION' | 'JOINED';
export type UserOnlineStatus = 'ONLINE' | 'OFFLINE';
export type TeamStatus = 'DOING' | 'DONE';
export type UserStatus = 'ONLINE' | 'OFFLINE';
export type Gender = 'UNSPECIFIED' | 'MALE' | 'FEMALE';

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  userStatus: UserStatus;
  profile: UserProfile;
  members: [Member];
};
