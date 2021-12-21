import { gql } from '@apollo/client';

const createTeam = gql`
  mutation createTeam(
    $name: String!
    $startDate: String!
    $endDate: String!
    $description: String
    $isPublic: Boolean
    $picture: String
  ) {
    createTeam(
      name: $name
      startDate: $startDate
      endDate: $endDate
      description: $description
      isPublic: $isPublic
      picture: $picture
    ) {
      id
      name
      ownerEmail
      createdAt
      startDate
      endDate
      status
      picture
      numOfMember
      isPublic
      description
    }
  }
`;

const updateTeam = gql`
  mutation updateTeam(
    $id: String!
    $name: String
    $startDate: String
    $endDate: String
    $status: String
    $picture: String
    $isPublic: Boolean
    $description: String
  ) {
    updateTeam(
      id: $id
      name: $name
      status: $status
      startDate: $startDate
      endDate: $endDate
      isPublic: $isPublic
      picture: $picture
      description: $description
    ) {
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
      }
    }
  }
`;

const deleteTeam = gql`
  mutation deleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      id
      name
      ownerEmail
      createdAt
      startDate
      endDate
      status
      picture
      numOfMember
      isPublic
      description
    }
  }
`;
export { createTeam, updateTeam, deleteTeam };
