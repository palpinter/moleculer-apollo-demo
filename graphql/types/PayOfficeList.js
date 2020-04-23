"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.PayOfficeList = gql`
	type PayOfficeList {
		rows: [JobClass]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
