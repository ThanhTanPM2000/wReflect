import { BoardType, Team, PhaseType } from '@prisma/client';
import { gql } from 'apollo-server-express';
import { BotLocaleFilterName } from 'aws-sdk/clients/lexmodelsv2';

const typeDefs = gql`
  enum PhaseType {
    REFLECT
    GROUP
    VOTES
    DISCUSS
  }

  type Board {
    id: ID
    teamId: String
    createdAt: String
    updatedAt: String
    createdBy: String
    isPublic: Boolean
    isLocked: Boolean
    disableDownVote: Boolean
    disableUpVote: Boolean
    isAnonymous: Boolean
    votesLimit: Int
    title: String
    timerInProgress: Int
    endTime: String
    currentPhase: PhaseType
    team: Team
    columns: [Column]
  }
`;

export type updateBoardType = {
  teamId: string;
  boardId: string;
  isPublic?: boolean;
  isLocked?: boolean;
  disableDownVote?: boolean;
  disableUpVote?: boolean;
  isAnonymous?: boolean;
  votesLimit?: number;
  title?: string;
  timerInProgress?: boolean;
  type?: BoardType;
  currentPhase?: PhaseType;
  endTime?: string;
};

export default typeDefs;
