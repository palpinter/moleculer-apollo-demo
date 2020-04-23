"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.jobClasses = gql`
	jobClasses(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): JobClassList
`;
