import { gql } from '@apollo/client';

const updateUser = gql`
  mutation updateUser($picture: String) {
    updateUser(picture: $picture) {
      id
      nickname
      email
      createdAt
      updatedAt
      isAdmin
      status
      picture
    }
  }
`;
export { updateUser };
