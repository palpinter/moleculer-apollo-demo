"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.User = gql`
	type User {
		_id: String!
		revision: Int!
		employee: Employee!
		username: String!
		email: String!
		phone: String
		validFrom: Date
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
