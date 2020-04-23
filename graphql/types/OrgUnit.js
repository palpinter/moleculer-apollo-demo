"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.OrgUnit = gql`
	type OrgUnit {
		_id: String!
		revision: Int
		company: Company!
		parent: OrgUnit
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
