import { gql } from '@apollo/client';
export const OPINION_FIELDS = gql`
  fragment OpinionFields on Opinion {
    id
    columnId
    authorId
    createdAt
    updatedAt
    text
    upVote
    downVote
    updatedBy
    isAction
    isBookmarked
    responsible
    mergedAuthors
    status
    color
    author {
      id
      email
      createdAt
      updatedAt
      isAdmin
      userStatus
      profile {
        id
        userId
        name
        nickname
        picture
      }
    }
    position
    remarks {
      id
      authorId
      opinionId
      text
      createdAt
      updatedAt
    }
  }
`;
