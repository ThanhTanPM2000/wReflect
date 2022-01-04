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

  # input orderOpinionInput {
  #   destination: {
  #     droppableId: String!
  #     index: Int!
  #   }
  #   source: {
  #     droppableId: String!
  #     index: Int!
  #   }
  #   draggableId: String!
  # }

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

    createOpinion(boardId: String!, columnId: String, text: String, isAction: Boolean): Opinion
    removeOpinion(opinionId: String): BatchPayload
    # orderOpinion(input: orderOpinionInput): String

    addMembers(emailUsers: [String!], teamId: String!): AddMembersMutationResponse
    removeMember(memberId: String!): BatchPayload
    changeRoleMember(memberId: String!, teamId: String!, isOwner: Boolean!): Member
  }
`;

export default typeDefs;
