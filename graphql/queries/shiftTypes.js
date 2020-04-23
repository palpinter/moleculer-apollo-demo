"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.shiftTypes = gql`
	shiftTypes(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): ShiftTypeList
`;
