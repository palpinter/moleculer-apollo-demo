"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.PayOffice = gql`
	type PayOffice {
		_id: String!
		revision: Int
		company: Company!
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
