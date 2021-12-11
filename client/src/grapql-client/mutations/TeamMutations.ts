import { gql } from '@apollo/client';

const AddNewTeam = gql`
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
      description
      ownerEmail
      startDate
      endDate
      status
      picture
    }
  }
`;

const deleteTeam = gql`
  mutation deleteTeam($teamId: Int) {
    deleteTeam(teamId: $teamId) {
      id
      name
      ownerEmail
      createAt
      startDate
      endDate
      status
      picture
      numOfMember
      isPublice
      description
    }
  }
`;
export { AddNewTeam, deleteTeam };
