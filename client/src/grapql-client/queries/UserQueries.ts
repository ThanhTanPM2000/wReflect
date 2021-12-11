import { gql } from '@apollo/client';

const getUsers = gql`
  query getUsers($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    users(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        email
        createAt
        updatedAt
        isAdmin
        status
        picture
      }
      total
    }
  }
`;

export { getUsers };
