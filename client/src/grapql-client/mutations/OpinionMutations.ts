import { Opinion } from './../../types';
import { gql } from '@apollo/client';

export type createOpinionVars = {
  boardId: string;
  columnId: string;
  text: string;
  isAction: boolean;
};

export type createOpinionResult = {
  createOpinion: Opinion;
};

export const createOpinion = gql`
  mutation CreateOpinion($boardId: String!, $columnId: String, $text: String, $isAction: Boolean) {
    createOpinion(boardId: $boardId, columnId: $columnId, text: $text, isAction: $isAction) {
      id
      columnId
      createdAt
      authorId
      updatedAt
      text
      downVote
      upVote
      updatedBy
      isAction
      isBookmarked
      responsible
      mergedAuthors
      color
      status
      remarks {
        id
        authorId
        text
        opinionId
        createdAt
        updatedAt
      }
      author {
        id
        email
      }
    }
  }
`;

export type removeOpinionResult = {
  removeOpinion: {
    count: number;
  };
};

export type removeOpinionVars = {
  opinionId: string;
};

export const removeOpinion = gql`
  mutation RemoveOpinion($opinionId: String) {
    removeOpinion(opinionId: $opinionId) {
      count
    }
  }
`;
