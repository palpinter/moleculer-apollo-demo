"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ProductList = gql`
	type ProductList {
		rows: [Product]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
