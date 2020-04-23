"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.orgUnit = gql`
	orgUnit(
		code: String!
	): OrgUnit
`;
