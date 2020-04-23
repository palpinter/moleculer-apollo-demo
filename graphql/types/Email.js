"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Email = gql`
	type Email {
		type: String!
		address: String!
	}
`;
