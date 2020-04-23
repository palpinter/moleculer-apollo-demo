"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteOrgUnit = gql`
	deleteOrgUnit(
		_id: String!
	): OrgUnit
`;
