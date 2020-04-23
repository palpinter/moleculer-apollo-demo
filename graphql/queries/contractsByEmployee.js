"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contractsByEmployee = gql`
	contractsByEmployee(
		employee: String!
	): [Contract]
`;
