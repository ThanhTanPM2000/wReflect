import { gql } from '@apollo/client';
import { Board } from '../../types';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type orderOpinionResult = {
  orderOpinion: Board;
};

export type orderOpinionVars = {
  destination: {
    droppableId: string;
    index: number;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
};

const orderOpinion = gql`
  ${BOARD_FIELDS}
  mutation OrderOpinion($destination: orderOpinion, $source: orderOpinion, $draggableId: String) {
    orderOpinion(destination: $destination, source: $source, draggableId: $draggableId) {
      ...BoardFields
    }
  }
`;

export { orderOpinion };
