"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.OrgUnitList = gql`
	type OrgUnitList {
		rows: [OrgUnit]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
