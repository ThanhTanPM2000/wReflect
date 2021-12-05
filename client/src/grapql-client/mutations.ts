import { gql } from '@apollo/client';

const AddNewTeam = gql`
  mutation addNewTeam($name: String!, $description: String, $startDate: String!, $endDate: String!, $picture: String) {
    createTeam(name: $name, description: $description, startDate: $startDate, endDate: $endDate, picture: $picture) {
      name
      description
      startDate
      endDate
      picture
    }
  }
`;
export { AddNewTeam };
