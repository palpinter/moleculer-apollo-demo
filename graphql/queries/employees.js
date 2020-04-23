"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.employees = gql`
	employees(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): EmployeeList
`;
