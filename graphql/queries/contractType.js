"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contractType = gql`
	contractType(
		code: String!
	): ContractType
`;
