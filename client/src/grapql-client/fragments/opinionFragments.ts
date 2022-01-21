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
    position
    remarks {
      id
      authorId
      opinionId
      text
      createdAt
      updatedAt
      author {
        id
        email
        name
        nickname
        picture
      }
    }
    author {
      id
      email
      name
      nickname
      picture
    }
  }
`;
