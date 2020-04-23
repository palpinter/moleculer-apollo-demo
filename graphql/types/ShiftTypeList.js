"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ShiftTypeList = gql`
	type ShiftTypeList {
		rows: [JobClass]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
