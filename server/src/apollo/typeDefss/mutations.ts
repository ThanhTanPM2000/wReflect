import { Remark, Opinion } from '@prisma/client';
import { orderOpinionType } from './opinionTypeDefs';
import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type AddMembersMutationResponse {
    success: [String]
    warnings: [String]
    errors: [String]
  }

  type BatchPayload {
    count: Int!
  }

  input orderOpinion {
    droppableId: String!
    index: Int!
  }

  input combineOpinion {
    droppableId: String!
    draggableId: String!
  }

  enum PhaseType {
    DEFAULT
    PHASE
  }

  enum OpinionStatus {
    NEW
    IN_PROGRESS
    DONE
    REJECTED
  }

  type Mutation {
    createTeam(
      name: String!
      description: String
      startDate: String!
      endDate: String!
      status: String
      isPublic: Boolean
      picture: String
    ): Team
    updateTeam(
      id: String!
      name: String
      startDate: String
      endDate: String
      status: String
      isPublic: Boolean
      picture: String
      description: String
    ): Team

    deleteTeam(teamId: String!): BatchPayload
    changeTeamAccess(teamId: String!, isPublic: Boolean!): BatchPayload

    createBoard(
      teamId: String!
      boardId: String!
      isPublic: Boolean
      isLocked: Boolean
      disableDownVote: Boolean
      disableUpVote: Boolean
      isAnonymous: Boolean
      votesLimit: Int
      title: String
      timerInProgress: Boolean
      type: BoardType
      currentPhase: PhaseType
      endTime: String
      column1: String
      column2: String
      column3: String
      column4: String
      column5: String
      isActiveCol1: Boolean
      isActiveCol2: Boolean
      isActiveCol3: Boolean
      isActiveCol4: Boolean
      isActiveCol5: Boolean
    ): Team

    updateBoard(
      teamId: String!
      boardId: String!
      isPublic: Boolean
      isLocked: Boolean
      disableDownVote: Boolean
      disableUpVote: Boolean
      isAnonymous: Boolean
      votesLimit: Int
      title: String
      timerInProgress: Boolean
      type: BoardType
      currentPhase: PhaseType
      endTime: String
      column1: String
      column2: String
      column3: String
      column4: String
      column5: String
      isActiveCol1: Boolean
      isActiveCol2: Boolean
      isActiveCol3: Boolean
      isActiveCol4: Boolean
      isActiveCol5: Boolean
    ): Board

    createOpinion(
      teamId: String!
      boardId: String!
      columnId: String!
      text: String
      isAction: Boolean
      isCreateBottom: Boolean
    ): Board
    updateOpinion(
      teamId: String!
      boardId: String!
      columnId: String!
      opinionId: String!
      text: String
      upVote: [String]
      downVote: [String]
      isAction: Boolean
      isBookmarked: Boolean
      responsible: String
      color: String
      status: OpinionStatus
    ): Opinion
    removeOpinion(teamId: String!, boardId: String!, columnId: String!, opinionId: String!): Board
    orderOpinion(destination: orderOpinion, source: orderOpinion, draggableId: String): Board
    combineOpinion(combine: combineOpinion, source: orderOpinion, draggableId: String, text: String): Board

    createRemark(
      teamId: String!
      boardId: String!
      columnId: String!
      opinionId: String!
      opinionId: String
      text: String!
    ): Opinion
    removeRemark(teamId: String!, boardId: String!, columnId: String!, opinionId: String!, remarkId: String!): Opinion

    addMembers(emailUsers: [String!], teamId: String!): AddMembersMutationResponse
    removeMember(memberId: String!): BatchPayload
    changeRoleMember(memberId: String!, teamId: String!, isOwner: Boolean!): Member
  }
`;

export default typeDefs;
