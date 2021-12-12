import { gql } from '@apollo/client';

const getListMembers = gql`
  query getListMembers($teamId: Int!) {
    members(teamId: $teamId) {
      userId
      teamId
      isOwner
      joinedAt
      assignedBy
      user {
        email
        name
        createdAt
        updatedAt
        isAdmin
        status
        picture
      }
    }
  }
`;

export { getListMembers };
