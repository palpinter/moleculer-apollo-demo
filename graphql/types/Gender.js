"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Gender = gql`
	type Gender {
		_id: String!
		revision: Int
		code: String!
		name: String!
		validFrom: Date!
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
