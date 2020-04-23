"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.jobClass = gql`
	jobClass(
		code: String!
	): JobClass
`;
