import { gql } from '@apollo/client';

const addNewMember = gql`
  mutation addMembers($emailUsers: [String], $teamId: Int) {
    addMember(emailUsers: $emailUsers, teamId: $teamId) {
      success
      errors
    }
  }
`;

const removeMember = gql`
  mutation removeMember($email: String!, $teamId: Int!) {
    removeMember(email: $email, teamId: $teamId) {
      isOwner
      userId
      teamId
      joinedAt
      assignedBy
    }
  }
`;

const setRoleMember = gql`
  mutation setRoleMember($email: String!, $teamId: Int!, $isOwner: Boolean!) {
    setRoleMember(email: $email, teamId: $teamId, isOwner: $isOwner) {
      isOwner
      userId
      teamId
      joinedAt
      assignedBy
    }
  }
`;

export { addNewMember as AddNewMember, removeMember as RemoveMember, setRoleMember as SetRoleMember };
