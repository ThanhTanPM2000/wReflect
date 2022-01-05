import { Board } from './../../types';
import { gql } from '@apollo/client';

export type getBoardsResult = {
  boards: Board[];
};

export type getBoardsVars = {
  teamId: string;
};

export const getBoards = gql`
  query Boards($teamId: String!) {
    boards(teamId: $teamId) {
      id
      teamId
      createdAt
      updatedAt
      createdBy
      isLocked
      isPublic
      disableDownVote
      disableUpVote
      votesLimit
      isAnonymous
      title
      endTime
      timerInProgress
      columns {
        id
        color
        title
        isActive
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
          responsible
          isBookmarked
          mergedAuthors
          color
          status
          author {
            id
            email
          }
          remarks {
            id
            authorId
            opinionId
            text
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export type getBoardResult = {
  board: Board;
};

export type getBoardVars = {
  boardId: string;
};

export const getBoard = gql`
  query Query($boardId: String) {
    board(boardId: $boardId) {
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
      endTime
      columns {
        id
        color
        title
        isActive
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
          status
          color
          author {
            id
            email
            createdAt
            updatedAt
            isAdmin
            userStatus
            profile {
              id
              userId
              name
              nickname
              picture
            }
          }
          position
          remarks {
            id
            authorId
            opinionId
            text
            createdAt
            updatedAt
          }
        }
        boardId
      }
      team {
        id
        name
        createdAt
        ownerUserIds
        startDate
        endDate
        picture
        numOfMember
        isPublic
        status
        description
        members {
          id
          userId
          teamId
          isOwner
          isPendingInvitation
          isGuess
          invitedBy
          joinedAt
          role
          user {
            id
            email
            createdAt
            isAdmin
            updatedAt
            userStatus
            profile {
              id
              userId
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
