"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createCompany = gql`
    createCompany(
        name: String!,
		shortName: String!
		country: String!
		taxNumber: String!
		registrationNumber: String!
		bankAccountNumber: String!
		IBAN: String!
		SWIFT: String!
		logoFile: String
		lawType: String!
        validFrom: String!,	
        validTo: String
    ): Company
`;
