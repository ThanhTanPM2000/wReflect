import { gql } from '@apollo/client';

const addNewTeam = gql`
  mutation createTeam(
    $name: String!
    $startDate: String!
    $endDate: String!
    $description: String
    $isPublish: Boolean
    $picture: String
  ) {
    createTeam(
      name: $name
      startDate: $startDate
      endDate: $endDate
      description: $description
      isPublish: $isPublish
      picture: $picture
    ) {
      id
      name
      description
      ownerEmail
      startDate
      endDate
      status
      picture
    }
  }
`;

const updateTeam = gql`
  mutation updateTeam(
    $id: Int!
    $name: String
    $startDate: String
    $endDate: String
    $status: String
    $picture: String
    $description: String
  ) {
    updateTeam(
      id: $id
      name: $name
      status: $status
      startDate: $startDate
      endDate: $endDate
      picture: $picture
      description: $description
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
      isPublish
      description
      members {
        isOwner
        joinedAt
        assignedBy
      }
    }
  }
`;

const deleteTeam = gql`
  mutation deleteTeam($teamId: Int) {
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
      isPublish
      description
    }
  }
`;
export { addNewTeam, updateTeam, deleteTeam };
