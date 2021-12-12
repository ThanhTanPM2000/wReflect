import { gql } from '@apollo/client';

const getTeam = gql`
  query getTeam($teamId: Int) {
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
      isPublice
      description
      members {
        isOwner
        userId
        teamId
        joinedAt
        assignedBy
        user {
          id
          name
          email
          createdAt
          updatedAt
          isAdmin
          status
          picture
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
          userId
          isOwner
          userId
          user {
            id
            email
            picture
          }
        }
      }
      total
    }
  }
`;

export { getTeams, getTeam };
