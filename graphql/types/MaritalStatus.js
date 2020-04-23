"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.MaritalSatus = gql`
	type MaritalStatus {
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
