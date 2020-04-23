"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Address = gql`
	type Address {
		country: String!
		zip: String!
		city: String
		district: String
		streetName: String!
		streetType: StreetType!
		streetNumber: String!
		building: String
		stairway: String
		floor: String
		door: String
		postBox: String
	}
`;
