import { GraphQLObjectType } from 'graphql';
// import { deleteTeam, createTeam } from './mutations';
import createTeam from './mutations/createTeam';
import updateTeam from './mutations/updateTeam';
import deleteTeam from './mutations/deleteTeam';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTeam,
    updateTeam,
    deleteTeam,
  },
});

export default Mutation;
