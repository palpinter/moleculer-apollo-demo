"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createOrgUnit = gql`
	createOrgUnit(
		company: String!,
		code: String!,
		parent: String,
		name: String!,
		validFrom: Date!,
		validTo: Date
	): OrgUnit
`;
