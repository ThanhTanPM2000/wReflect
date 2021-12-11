import { gql } from '@apollo/client';

const AddNewMember = gql`
  mutation addMembers($emailUsers: [String], $teamId: Int) {
    addMember(emailUsers: $emailUsers, teamId: $teamId) {
      success
      errors
    }
  }
`;

const RemoveMember = gql`
  mutation removeMember($userId: Int!, $teamId: Int!) {
    removeMember(userId: $userId, teamId: $teamId) {
      isOwner
      userId
      teamId
      joinedAt
      assignedBy
    }
  }
`;

const SetRoleMember = gql`
  mutation setRoleMember($userId: Int!, $teamId: Int!, $isOwner: Boolean!) {
    setRoleMember(userId: $userId, teamId: $teamId, isOwner: $isOwner) {
      isOwner
      userId
      teamId
      joinedAt
      assignedBy
    }
  }
`;

export { AddNewMember, RemoveMember, SetRoleMember };
