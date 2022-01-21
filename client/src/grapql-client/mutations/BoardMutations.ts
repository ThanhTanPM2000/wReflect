import { gql } from '@apollo/client';
import { Board, BoardType, PhaseType } from '../../types';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
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

const updateBoard = gql`
  ${BOARD_FIELDS}
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $isPublic: Boolean
    $isLocked: Boolean
    $disableDownVote: Boolean
    $disableUpVote: Boolean
    $isAnonymous: Boolean
    $votesLimit: Int
    $title: String
    $timerInProgress: Boolean
    $type: Boolean
    $currentPhase: PhaseType
    $endTime: String
  ) {
    updateBoard(
      teamId: $teamId
      boardId: $boardId
      isPublic: $isPublic
      isLocked: $isLocked
      disableDownVote: $disableDownVote
      disableUpVote: $disableUpVote
      isAnonymous: $isAnonymous
      votesLimit: $votesLimit
      title: $title
      timerInProgress: $timerInProgress
      type: $type
      currentPhase: $currentPhase
      endTime: $endTime
    ) {
      ...BoardFields
    }
  }
`;

export { updateBoard };
