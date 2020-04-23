"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.AddressInput = gql`
	input AddressInput {
		country: String!
		zip: String!
		city: String
		district: String
		streetName: String!
		streetType: String!
		streetNumber: String!
		building: String
		stairway: String
		floor: String
		door: String
		postBox: String
	}
`;
