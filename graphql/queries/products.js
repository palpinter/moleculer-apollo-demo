"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.products = gql`
	products(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): ProductList
`;
