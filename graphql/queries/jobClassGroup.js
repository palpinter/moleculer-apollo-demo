"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.jobClassGroup = gql`
	jobClassGroup(
		code: String!
	): JobClassGroup
`;
