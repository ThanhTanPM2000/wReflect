import { gql } from '@apollo/client';

const getListMembers = gql`
  query getListMembers($teamId: Int!) {
    members(teamId: $teamId) {
      id
      email
      teamId
      isOwner
      joinedAt
      assignedBy
      status
      user {
        email
        createdAt
        updatedAt
        isAdmin
        status
        profile {
          picture
        }
      }
    }
  }
`;

export { getListMembers };
