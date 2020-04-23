"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Property = gql`
	type Property {
		_id: String!
		revision: Int
		resource: String!
		resourceId: String
		key: String!
		value: String!
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
