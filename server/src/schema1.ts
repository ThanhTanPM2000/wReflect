import { buildSchema } from 'graphql';

const schema = buildSchema(`
	type User {
		id: Int
		name: String
		email: String
		createdAt: String
		updatedAt: String
		isAdmin: Boolean
		status: String
		members: [Member!]
		picture: String
		profile: Profile
	}

	type Team {
		id: Int
		name: String
		ownerEmail: [String!]
		createdAt: String
		startDate: String
		endDate: String
		status: String
		picture: String
		numOfMember: Int
		isPublish: Boolean
		description: String
		members: [Member]
	}

	type Member {
		isOwner: Boolean
		userId: Int
		teamId: Int
		joinedAt: String
		assignedBy: String
		user: User
		team: Team
	}

	type Profile {
		id: Int
		firstName: String
		lastName: String
		gender: String
		workplace: String
		userStatus: String
		school: String
		introduction: String
		userId: Int
		talents: String
		interests: String
		createdAt: String
		updatedAt: String
		phoneNumbers: [String]
		photos: [String]
	}

	type Users {
		data: [User!]
		total: Int
	}
	type Teams  {
		data: [Team!]
		total: Int
	}

	type Query {
		users : Users
		teams(status: String, isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
		user(userId: Int): User! 
		team(userId: Int): Team!
		members(teamId: Int): [Member!]
	}

	type Mutation {
		createTeam(name: String!, description: String, startDate: String!, endDate: String!, status: String, isPublish: Boolean, picture: String): Team
	}

`);

export default schema;
