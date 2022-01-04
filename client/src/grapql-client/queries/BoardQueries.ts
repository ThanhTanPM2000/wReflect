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
      hello
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
  query Board($boardId: String) {
    board(boardId: $boardId) {
      id
      teamId
      updatedAt
      createdAt
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
      hello
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
      team {
        id
        name
        ownerUserIds
        createdAt
        startDate
        endDate
        picture
        numOfMember
        isPublic
        description
        status
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
            updatedAt
            isAdmin
            userStatus
            profile {
              id
              userId
              name
              nickname
              picture
              workplace
              address
              school
              introduction
              talent
              interest
              createdAt
              updatedAt
              gender
            }
          }
        }
      }
    }
  }
`;
