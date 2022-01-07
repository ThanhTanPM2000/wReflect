import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Opinion {
    id: ID
    columnId: String
    authorId: String
    createdAt: String
    updatedAt: String
    text: String
    upVote: [String]
    downVote: [String]
    updatedBy: String
    isAction: Boolean
    isBookmarked: Boolean
    responsible: String
    mergedAuthors: [String]
    color: String
    status: OpinionStatus
    author: User
    position: Int
    column: Column
    remarks: [Remark]
  }

  enum OpinionStatus {
    NEW
    IN_PROGRESS
    DONE
    REJECT
  }
`;

export type createOpinionType = {
  boardId: string;
  columnId: string;
  text: string;
  isAction: boolean;
  isCreateBottom: boolean;
};

export type removeOpinionType = {
  opinionId: string;
};

export type orderOpinionType = {
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

export type combineOpinionType = {
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

export default typeDefs;
