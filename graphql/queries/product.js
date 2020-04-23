"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.product = gql`
	product(
		code: String!
	): Product
`;
