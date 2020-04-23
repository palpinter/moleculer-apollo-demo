"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.EmploymentTypeList = gql`
	type EmploymentTypeList {
		rows: [EmploymentType]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
