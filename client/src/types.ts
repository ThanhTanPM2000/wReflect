export type Teams = {
  data: [Team];
  total: number;
};

export type Team = {
  id: string;
  name: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  picture: string;
  isPublic: boolean;
  description: string | null;
  status: TeamStatus;
  members: Member[];
  boards: Board[];
};

export type Board = {
  id: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  isLocked: boolean;
  disableDownVote: boolean;
  disableUpVote: boolean;
  isAnonymous: boolean;
  votesLimit: number;
  title: string;
  timerInProgress: boolean;
  type: BoardType;
  currentPhase: PhaseType;
  endTime: string;
  team: Team;
  columns: Column[];
};

export type Column = {
  id: string;
  color: string;
  title: string;
  isActive: boolean;
  boardId: string;
  board: Board;
  opinions: Opinion[];
};

export type Opinion = {
  id: string;
  columnId: string | null;
  authorId: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  upVote: string[];
  downVote: string[];
  updatedBy: string;
  isAction: boolean;
  isBookmarked: boolean;
  responsible: string;
  mergedAuthors: string[];
  color: string;
  position: number;
  status: OpinionStatus;
  column: Column;
  remarks: Remark[];
  author: User;
  member: Member;
};

export type Remark = {
  id: string;
  authorId: string;
  opinionId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  opinion: Opinion;
  author: User;
  member: Member;
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
export type OpinionStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';
export type BoardType = 'DEFAULT' | 'PHASE';
export type PhaseType = 'REFLECT' | 'GROUP' | 'VOTES' | 'DISCUSS';

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  name: string;
  nickname: string;
  picture: string;
  userStatus: UserStatus;
  profile: UserProfile;
  members: [Member];
};
