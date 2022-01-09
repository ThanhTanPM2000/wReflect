import { Column, Opinion } from './../../types';
import { gql } from '@apollo/client';

export type createOpinionVars = {
  boardId: string;
  columnId: string;
  text: string;
  isAction: boolean;
  isCreateBottom: boolean;
};

export type createOpinionResult = {
  createOpinion: Column;
};

export const createOpinion = gql`
  mutation Mutation($boardId: String!, $columnId: String, $text: String, $isAction: Boolean, $isCreateBottom: Boolean) {
    createOpinion(
      boardId: $boardId
      columnId: $columnId
      text: $text
      isAction: $isAction
      isCreateBottom: $isCreateBottom
    ) {
      id
      color
      title
      isActive
      boardId
      opinions {
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
        color
        status
        position
        remarks {
          id
          authorId
          opinionId
          text
          createdAt
          updatedAt
        }
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
      }
    }
  }
`;

export type updateOpinionResult = {
  updateOpinion: string;
};

export type updateOpinionVars = {
  opinionId: string;
  text?: string;
  upVote?: string[];
  isAction?: boolean;
  isBookmarked?: boolean;
  responsible?: string;
  color?: string;
  status?: string;
};

export const updateOpinion = gql`
  mutation Mutation(
    $opinionId: String!
    $text: String
    $upVote: [String]
    $isAction: Boolean
    $isBookmarked: Boolean
    $responsible: Boolean
    $color: String
    $status: String
  ) {
    updateOpinion(
      opinionId: $opinionId
      text: $text
      upVote: $upVote
      isAction: $isAction
      isBookmarked: $isBookmarked
      responsible: $responsible
      color: $color
      status: $status
    )
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

export type combineOpinionResult = {
  combineOpinion: string;
};

export type combineOpinionVars = {
  combine: {
    draggableId: string;
    droppableId: string;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
  text: string;
};

export const combineOpinion = gql`
  mutation Mutation($combine: combineOpinion, $source: orderOpinion, $draggableId: String, $text: String) {
    combineOpinion(combine: $combine, source: $source, draggableId: $draggableId, text: $text)
  }
`;
