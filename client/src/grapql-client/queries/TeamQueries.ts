import { gql } from '@apollo/client';

export type variables = {
  $teamId: number;
};

const getTeam = gql`
  query getTeam($teamId: Int!) {
    team(teamId: $teamId) {
      id
      name
      ownerEmail
      createdAt
      startDate
      endDate
      status
      picture
      numOfMember
      isPublish
      description
      members {
        isOwner
        email
        teamId
        joinedAt
        assignedBy
        status
        user {
          id
          nickname
          email
          createdAt
          updatedAt
          isAdmin
          status
          profile {
            id
            userId
            name
            nickname
            gender
            picture
          }
        }
      }
    }
  }
`;

const getTeams = gql`
  query teams($status: String, $isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    teams(status: $status, isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        description
        picture
        members {
          id
          email
          joinedAt
          assignedBy
          status
          isOwner
          user {
            id
            email
            profile {
              picture
            }
          }
        }
      }
      total
    }
  }
`;

export { getTeams, getTeam };
