"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.orgUnits = gql`
	orgUnits(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): OrgUnitList
`;
