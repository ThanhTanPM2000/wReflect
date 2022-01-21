import { gql } from '@apollo/client';
import { Board } from '../../types';

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
  meId: string;
};

export const updateBoard = gql`
  subscription Subscription($meId: ID!) {
    updateBoard(meId: $meId) {
      id
      teamId
      createdAt
      updatedAt
      createdBy
      isPublic
      isLocked
      disableDownVote
      disableUpVote
      isAnonymous
      votesLimit
      title
      timerInProgress
      currentPhase
      endTime
      columns {
        id
        color
        title
        isActive
        boardId
        opinions {
          id
          columnId
          authorId
          createdAt
          updatedAt
          text
          upVote
          downVote
          updatedBy
          isAction
          isBookmarked
          responsible
          mergedAuthors
          color
          status
          author {
            id
            email
            createdAt
            updatedAt
            isAdmin
            userStatus
            name
            nickname
            picture
          }
          position
          remarks {
            id
            authorId
            opinionId
            text
            createdAt
            updatedAt
            author {
              id
              email
              createdAt
              updatedAt
              name
              nickname
              picture
            }
          }
        }
      }
    }
  }
`;
