"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.EmployeeList = gql`
	type EmployeeList {
		rows: [Employee]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
