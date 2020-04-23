"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateOrgUnit = gql`
	updateOrgUnit(
		_id: String!, 
		company: String,
		code: String,
		parent: String,
		name: String,
		validFrom: Date,
		validTo: Date
	): OrgUnit
`;
