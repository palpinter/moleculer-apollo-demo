"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.properties = gql`
	properties(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): PropertyList
`;
