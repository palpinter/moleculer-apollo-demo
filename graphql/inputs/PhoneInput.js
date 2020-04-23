"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.PhoneInput = gql`
	input PhoneInput {
		type: String!
		number: String!
	}
`;
