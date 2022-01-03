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
`;

export default typeDefs;
