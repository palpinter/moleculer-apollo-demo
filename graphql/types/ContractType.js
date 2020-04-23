"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ContractType = gql`
	type ContractType {
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
