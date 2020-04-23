"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.payOffices = gql`
	payOffices(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): PayOfficeList
`;
