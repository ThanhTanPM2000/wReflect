import { gql } from '@apollo/client';
import { Remark } from '../../types';

export type createRemarkResult = {
  createRemark: Remark;
};

export type createRemarkVars = {
  opinionId: string;
  text: string;
};

const createRemark = gql`
  mutation Mutation($opinionId: String, $text: String) {
    createRemark(opinionId: $opinionId, text: $text) {
      id
      authorId
      opinionId
      text
      createdAt
      updatedAt
      author {
        id
        email
        profile {
          id
          name
          nickname
          picture
        }
      }
    }
  }
`;

export type removeRemarkResult = {
  removeResult: {
    count: number;
  };
};

export type removeRemarkVars = {
  remarkId: string;
};

export const removeRemark = gql`
  mutation Mutation($remarkId: String) {
    removeRemark(remarkId: $remarkId) {
      count
    }
  }
`;

export { createRemark };
