"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Product = gql`
	type Product {
		_id: String!
		revision: Int
		company: Company!
		code: String!
		name: String!
		subscription: Boolean!
		validFrom: Date!
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
