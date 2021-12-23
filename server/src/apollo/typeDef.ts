import { StatusCodes } from 'http-status-codes';
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    email: String
    createdAt: String
    updatedAt: String
    isAdmin: String
    userStatus: String
    members: [Member]
    profile: Profile
  }

  type Profile {
    id: ID!
    userId: String!
    name: String!
    nickname: String!
    picture: String!
    workplace: String
    address: String
    school: String
    introduction: String
    talent: String
    interest: String
    createdAt: String!
    updatedAt: String!
    gender: Gender
    user: User
  }

  enum Gender {
    UNSPECIFIED
    MALE
    FEMALE
  }

  type Member {
    id: ID!
    userId: String!
    teamId: String!
    isOwner: Boolean!
    isPendingInvitation: Boolean!
    isGuess: Boolean!
    invitedBy: String
    joinedAt: String!
    role: String
    user: User
    team: Team
  }

  type Team {
    id: ID
    name: String
    ownerUserIds: [String]
    createdAt: String
    startDate: String
    endDate: String
    picture: String
    numOfMember: Int
    isPublic: Boolean
    status: TeamStatus
    description: String
    members: [Member]
  }

  enum TeamStatus {
    DOING
    DONE
  }

  interface ListData {
    total: Int
  }

  type Teams implements ListData {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  type Users implements ListData {
    data: [User]
    total: Int
    page: Int
    size: Int
  }

  input TeamsInput {
    status: String @constraint(pattern: "^(DOING|DONE)$")
    isGettingAll: Boolean
    search: String
    page: Int
    size: Int
  }

  type Query {
    # me: User
    teams(input: TeamsInput): Teams
    team(teamId: String!): Team
    user(userId: String!): User
    users(isGettingAll: Boolean, search: String, page: Int, size: Int): ListData
    members(teamId: String!): [Member]
  }

  type AddMembersMutationResponse {
    success: [String]
    warnings: [String]
    errors: [String]
  }

  type BatchPayload {
    count: Int!
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

    addMembers(emailUsers: [String!], teamId: String!): AddMembersMutationResponse
    removeMember(memberId: String!): BatchPayload
    changeRoleMember(memberId: String!, teamId: String!, isOwner: Boolean!): Member
  }
`;

export default typeDefs;
