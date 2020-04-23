"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contractTerminationTypes = gql`
	contractTerminationType(
		code: String!
	): ContractTerminationType
`;
