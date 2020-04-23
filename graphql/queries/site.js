"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.site = gql`
	site(
		code: String!
	): Site
`;
