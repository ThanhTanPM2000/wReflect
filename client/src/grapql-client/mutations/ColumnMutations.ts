import { gql } from '@apollo/client';
import { Column } from '../../types';

export type orderOpinionResult = {
  orderOpinion: Column[];
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
  mutation Mutation($destination: orderOpinion, $source: orderOpinion, $draggableId: String) {
    orderOpinion(destination: $destination, source: $source, draggableId: $draggableId)
  }
`;

// const combineOpinion = gql`
// `

export { orderOpinion };
