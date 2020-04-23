"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contracts = gql`
	contracts(
		page: Int,
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): ContractList
`;
