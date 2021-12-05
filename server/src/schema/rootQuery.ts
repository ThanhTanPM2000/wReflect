import { GraphQLObjectType } from 'graphql';

import team from './queries/team';
import teams from './queries/teams';
import users from './queries/users';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    team,
    teams,
    users,
  },
});

export default RootQuery;
