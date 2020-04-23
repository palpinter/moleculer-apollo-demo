"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.PropertyList = gql`
	type PropertyList {
		rows: [JobClass]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
