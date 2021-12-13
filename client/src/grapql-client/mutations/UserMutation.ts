import { gql } from '@apollo/client';

const updateUser = gql`
  mutation updateUser(
    $firstName: String
    $lastName: String
    $gender: String
    $workplace: String
    $userStatus: String
    $school: String
    $introduction: String
    $phoneNumbers: [String]
    $photos: [String]
    $talents: String
    $interests: String
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      workplace: $workplace
      userStatus: $userStatus
      school: $school
      introduction: $introduction
      phoneNumbers: $phoneNumbers
      photos: $photos
      talents: $talents
      interests: $interests
    ) {
      id
      name
      email
      createdAt
      updatedAt
      isAdmin
      status
      picture
      profile {
        id
        lastName
        firstName
        school
        workplace
        userStatus
        introduction
        talents
        interests
        createdAt
        updatedAt
      }
    }
  }
`;
export { updateUser };
