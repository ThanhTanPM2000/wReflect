import { Board, Column, Opinion } from './../../types';
import { gql } from '@apollo/client';
import { BOARD_FIELDS } from '../fragments/boardFragment';

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
  ${BOARD_FIELDS}
  mutation Mutation($boardId: String!, $columnId: String, $text: String, $isAction: Boolean, $isCreateBottom: Boolean) {
    createOpinion(
      boardId: $boardId
      columnId: $columnId
      text: $text
      isAction: $isAction
      isCreateBottom: $isCreateBottom
    ) {
      ...BoardFields
    }
  }
`;

export type updateOpinionResult = {
  updateOpinion: string;
};

export type updateOpinionVars = {
  boardId: string;
  columnId: string;
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
  ${BOARD_FIELDS}
  mutation updateOpinion(
    $boardId: String!
    $columnId: String!
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
      boardId: $boardId
      columnId: $columnId
      opinionId: $opinionId
      text: $text
      upVote: $upVote
      isAction: $isAction
      isBookmarked: $isBookmarked
      responsible: $responsible
      color: $color
      status: $status
    ) {
      ...BoardFields
    }
  }
`;

export type removeOpinionResult = {
  removeOpinion: Board;
};

export type removeOpinionVars = {
  boardId: string;
  columnId: string;
  opinionId: string;
};

export const removeOpinion = gql`
  ${BOARD_FIELDS}
  mutation RemoveOpinion($boardId: String, $columnId: String, $opinionId: String) {
    removeOpinion(boardId: $boardId, columnId: $columnId, opinionId: $opinionId) {
      ...BoardFields
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
  ${BOARD_FIELDS}
  mutation Mutation($combine: combineOpinion, $source: orderOpinion, $draggableId: String, $text: String) {
    combineOpinion(combine: $combine, source: $source, draggableId: $draggableId, text: $text) {
      ...BoardFields
    }
  }
`;
