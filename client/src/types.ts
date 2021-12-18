export type Team = {
  id: number;
  name: string;
  ownerEmail: string[];
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  status: TeamStatus;
  picture: string;
  numOfMember: number;
  isPublish: boolean;
  description: string | null;
  members: [Member];
};

export type Member = {
  id: number;
  isOwner: boolean;
  email: string | null;
  teamId: number;
  joinedAt: Date;
  assignedBy: string | null;
  status: MemberStatus;
  user: User;
  team: Team;
};

export type UserProfile = {
  id: number;
  userId: number;
  name: string;
  picture: string;
  nickname: string;
  gender: string;
  workplace: string | null;
  address: string | null;
  userStatus: UserOnlineStatus;
  school: string | null;
  introduction: string | null;
  phoneNumber: string | null;
  talents: string | null;
  interests: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type Session = {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  data: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MemberStatus = 'PENDING_INVITATION' | 'JOINED';
export type UserOnlineStatus = 'ONLINE' | 'OFFLINE';
export type TeamStatus = 'DOING' | 'DONE';

export type User = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  status: string;
  profile: UserProfile;
  members: [Member];
};
