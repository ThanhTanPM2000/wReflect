import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Board {
    id: ID
    teamId: String
    createdAt: String
    updatedAt: String
    createdBy: String
    isPublic: Boolean
    isLocked: Boolean
    disableDownVote: Boolean
    disableUpVote: Boolean
    isAnonymous: Boolean
    votesLimit: Int
    title: String
    timerInProgress: Int
    endTime: Int
    hello: String
    team: Team
    columns: [Column]
  }

  type Column {
    id: ID
    color: String
    title: String
    isActive: Boolean
    opinions: [Opinion]
    boardId: String
    board: Board
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
    column: Column
    remarks: [Remark]
  }

  enum OpinionStatus {
    New
    In_Progress
    Done
    Rejected
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

  type Remark {
    id: ID
    authorId: String
    opinionId: String
    text: String
    createdAt: String
    updatedAt: String
    opinion: Opinion
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
    google: String
    description: String
    members: [Member]
    boards: [Board]
  }

  enum TeamStatus {
    DOING
    DONE
  }

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

  input TeamsInput {
    status: String @constraint(pattern: "^(DOING|DONE)$")
    isGettingAll: Boolean
    search: String
    page: Int
    size: Int
  }

  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
    hihi: Int
  }

  type getTeamIds {
    id: String
    name: String
    picture: String
  }

  type Query {
    teams(input: TeamsInput): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    user(userId: String!): User
    members(teamId: String!): [Member]
    boards(teamId: String!, boardId: String): [Board]
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
