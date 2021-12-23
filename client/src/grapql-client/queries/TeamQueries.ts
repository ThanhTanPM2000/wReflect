import { StringNullableChain } from 'lodash';
import { gql } from '@apollo/client';
import { Team } from '../../types';

export type getTeamVars = {
  teamId: string;
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

export type getTeamData = {
  team: Team;
};

export type getTeamsData = {
  teams: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};

const getTeam = gql`
  query getTeam($teamId: String!) {
    team(teamId: $teamId) {
      id
      name
      createdAt
      startDate
      endDate
      picture
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
`;

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
              userId
            }
          }
        }
      }
      total
      page
      size
    }
  }
`;

export { getTeams, getTeam };
