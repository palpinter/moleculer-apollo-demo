"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Company = gql`
	type Company {
		_id: String!
		revision: Int
		code: String!
		name: String!
		shortName: String!
		country: String!
		taxNumber: String!
		registrationNumber: String!
		bankAccountNumber: String!
		IBAN: String!
		SWIFT: String!
		logoFile: String
		lawType: String!
		validFrom: Date!
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
