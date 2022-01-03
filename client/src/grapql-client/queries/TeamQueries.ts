import { StringNullableChain } from 'lodash';
import { gql } from '@apollo/client';
import { Team } from '../../types';

export type getTeamVars = {
  teamId: string;
};

export type getTeamResult = {
  team: Team;
};

const getTeam = gql`
  query Query($teamId: String!) {
    team(teamId: $teamId) {
      id
      name
      ownerUserIds
      createdAt
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
      }
      boards {
        timerInProgress
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
  }
`;

export type getTeamsResult = {
  teams: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};

export type getTeamsVars = {
  input: {
    status?: string;
    isGettingAll?: boolean;
    search?: string;
    page?: number;
    size?: number;
  };
};

const getTeams = gql`
  query Teams($input: TeamsInput) {
    teams(input: $input) {
      data {
        id
        name
        ownerUserIds
        createdAt
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
        boards {
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
              color
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
    }
  }
`;

export type getTeamIdsResult = {
  getTeamIds: {
    id: string;
    name: string;
    picture: string;
    boardIds: string[];
  }[];
};

const getTeamIds = gql`
  query GetTeamIds {
    getTeamIds {
      id
      name
      picture
      boardIds
    }
  }
`;

export { getTeams, getTeam, getTeamIds };
