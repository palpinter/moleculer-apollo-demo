"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.CompanyList = gql`
	type CompanyList {
		rows: [Company]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
