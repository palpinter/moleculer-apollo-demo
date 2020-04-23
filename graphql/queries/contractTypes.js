"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.contractTypes = gql`
	contractTypes(
		page: Int,
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): ContractTypeList
`;
