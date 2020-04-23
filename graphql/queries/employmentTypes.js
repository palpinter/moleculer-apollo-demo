"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.epmloymentTypes = gql`
	employmentTypes(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): [EmploymentTypeList]
`;
