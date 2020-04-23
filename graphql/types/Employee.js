"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Employee = gql`
	type Employee {
		_id: String!
		revision: Int
		avatar: String
		code: String!
		prefixName: String
		lastName: String!
		middleName: String
		firstName: String!
		forename: String
		dateOfBirth: Date!
		placeOfBirth: String!
		countryOfBirth: String!
		mothersName: String!
		gender: Gender!
		maritalStatus: MaritalStatus!
		taxNumber: String
		socialSecurityNumber: String
		identityCardNumber: String
		nationality: String!
		preferredLanguage: String
		permanentAddress: Address!
		temporaryAddress: Address
		serviceAddress: Address
		phones: [Phone]
		emails: [Email]
		validFrom: Date!
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
