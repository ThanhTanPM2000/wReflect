import { gql } from '@apollo/client';

const addNewMember = gql`
  mutation addMembers($emailUsers: [String]!, $teamId: String!) {
    addMember(emailUsers: $emailUsers, teamId: $teamId) {
      success
      errors
    }
  }
`;

const removeMember = gql`
  mutation removeMember($memberId: String!) {
    removeMember(memberId: $memberId) {
      id
      userId
      teamId
      isOwner
      isPendingInvitation
      isGuess
      invitedBy
      joinedAt
    }
  }
`;

const setRoleMember = gql`
  mutation setRoleMember($memberId: String!, $isOwner: Boolean!) {
    setRoleMember(memberId: $memberId, isOwner: $isOwner) {
      id
      userId
      teamId
      isOwner
      isPendingInvitation
      isGuess
      invitedBy
      joinedAt
    }
  }
`;

export { addNewMember as AddNewMember, removeMember as RemoveMember, setRoleMember as SetRoleMember };
