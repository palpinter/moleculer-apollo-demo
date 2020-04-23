"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.payOffice = gql`
	payOffice(
		code: String!
	): PayOffice
`;
