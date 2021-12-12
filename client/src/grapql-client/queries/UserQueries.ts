import { gql } from '@apollo/client';

const getUser = gql`
  query getUser($userId: Int) {
    user(userId: $userId) {
      id
      name
      email
      createdAt
      updatedAt
      isAdmin
      status
      picture
      members {
        isOwner
        teamId
        joinedAt
        assignedBy
      }
      profile {
        id
        firstName
        lastName
        gender
        workplace
        userStatus
        school
        introduction
        talents
        interests
        createdAt
        updatedAt
        phoneNumbers
        photos
      }
    }
  }
`;

const getUsers = gql`
  query getUsers($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    users(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        email
        createdAt
        updatedAt
        isAdmin
        status
        picture
      }
      total
    }
  }
`;

export { getUsers, getUser };
