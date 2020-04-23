"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.companies = gql`
	companies(
		page: Int
		pageSize: Int
		sort: String
		search: String
		searchFields: String
	): CompanyList
`;
