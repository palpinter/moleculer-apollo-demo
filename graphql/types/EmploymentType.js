"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.EmploymentType = gql`
	type EmploymentType {
		_id: String!
		revision: Int
		code: String!
		name: String!
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
