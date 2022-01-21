import { Board } from './../../types';
import { gql } from '@apollo/client';
import { Remark } from '../../types';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type createRemarkResult = {
  createRemark: Board;
};

export type createRemarkVars = {
  boardId: string;
  columnId: string;
  opinionId: string;
  text: string;
};

export const createRemark = gql`
  ${BOARD_FIELDS}
  mutation Mutation($boardId: String, $columnId: String, $opinionId: String, $text: String) {
    createRemark(boardId: $boardId, columnId: $columnId, opinionId: $opinionId, text: $text) {
      ...BoardFields
    }
  }
`;

export type removeRemarkResult = {
  removeResult: Board;
};

export type removeRemarkVars = {
  boardId: string;
  columnId: string;
  opinionId: string;
  remarkId: string;
};

export const removeRemark = gql`
  ${BOARD_FIELDS}
  mutation RemoveRemark($opinionId: String!, $boardId: String, $columnId: String, $remarkId: String) {
    removeRemark(opinionId: $opinionId, boardId: $boardId, columnId: $columnId, remarkId: $remarkId) {
      ...BoardFields
    }
  }
`;
