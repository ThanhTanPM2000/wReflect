import { GraphQLObjectType } from 'graphql';

import team from './queries/team';
import teams from './queries/teams';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    team,
    teams,
  },
});

export default RootQuery;
