"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contract = gql`
	contract(
		code: String!
	): Contract
`;
