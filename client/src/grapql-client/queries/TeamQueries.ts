import { gql } from '@apollo/client';

export type variables = {
  $teamId: number;
};

const getTeam = gql`
  query getTeam($teamId: String!) {
    team(teamId: $teamId) {
      id
      name
      ownerEmail
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
            talents
            interests
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
  query teams($status: String, $isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    teams(status: $status, isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        ownerEmail
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
      }
      total
    }
  }
`;

export { getTeams, getTeam };
