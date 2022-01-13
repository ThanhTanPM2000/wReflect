import { Column, Opinion } from './../../types';
import { gql } from '@apollo/client';
import { BOARD_FIELDS } from '../fragments/boardFragment';
import { OPINION_FIELDS } from '../fragments/opinionFragments';

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
  ${OPINION_FIELDS}
  mutation updateOpinion(
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
    ) {
      ...OpinionFields
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
  ${BOARD_FIELDS}
  mutation RemoveOpinion($opinionId: String) {
    removeOpinion(opinionId: $opinionId) {
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
