"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.EmailInput = gql`
	input EmailInput {
		type: String!
		address: String!
	}
`;
