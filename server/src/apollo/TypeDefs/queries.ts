import { getListCriteria } from '../../services/criteria';
import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  type Assessments {
    data: [Assessment]
    total: Int
    page: Int
    size: Int
  }

  type getTeamIds {
    id: String
    name: String
    picture: String
    boards: [Board]
  }

  type getHealthCheck {
    memberAnswers: [MemberAnswer]
    memberComments: [MemberComment]
    healthCheck: HealthCheck
  }

  enum inviteStatus {
    JOINED
    UNJOINED
    UNLOGIN
  }

  type inviteResponse {
    status: inviteStatus
  }

  type essentialData {
    criteriaList: [Criteria]
  }

  enum filterOfAssessmentList {
    NAME
    DATE
    STATUS
  }

  enum sortType {
    asc
    desc
  }

  type Query {
    teams(status: String, isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getOwnedTeams(isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    members(teamId: String!): [Member]
    boards(teamId: String!): [Board]
    board(boardId: String): Board
    getAssessmentsList(
      teamId: String!
      isGettingAll: Boolean!
      orderBy: filterOfAssessmentList!
      sort: sortType!
      search: String
      offSet: Int!
      limit: Int!
    ): Assessments

    getAssessment(teamId: ID!, assessmentId: ID!): Assessment

    account(userId: String): User
    inviteLink(teamId: String): inviteResponse

    getHealthCheck(teamId: String, boardId: String): getHealthCheck

    getEssentialData: essentialData
  }
`;

export default typeDefs;
