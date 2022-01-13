import { StringNullableChain } from 'lodash';
import { gql } from '@apollo/client';
import { Board, Team } from '../../types';

import { BOARD_FIELDS } from '../fragments/boardFragment';

export type getTeamVars = {
  teamId: string;
};

export type getTeamResult = {
  team: Team;
};

const getTeam = gql`
  ${BOARD_FIELDS}
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
        ...BoardFields
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
  ${BOARD_FIELDS}
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
          ...BoardFields
        }
      }
      total
    }
  }
`;

export { getTeams, getTeam };
