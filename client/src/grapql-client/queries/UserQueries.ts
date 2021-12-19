import { gql } from '@apollo/client';

const login = gql`
  query login($code: String, $state: String) {
    login(code: $code, state: $state) {
      id
      name
      email
      picture
      status
    }
  }
`;

const me = gql`
  query me {
    me {
      id
      name
      email
      picture
      status
    }
  }
`;

const getUser = gql`
  query getUser($email: String!) {
    user(email: $email) {
      id
      email
      createdAt
      updatedAt
      isAdmin
      status
      members {
        id
        email
        isOwner
        teamId
        joinedAt
        assignedBy
        status
      }
      profile {
        id
        name
        nickname
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
      }
      total
    }
  }
`;

export { login, me, getUsers, getUser };
