import { gql } from '@apollo/client';

const getListMembers = gql`
  query getListMembers($teamId: String!) {
    members(teamId: $teamId) {
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
      }
    }
  }
`;

export { getListMembers };
