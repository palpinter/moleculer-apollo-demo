"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.workingPlaces = gql`
	workingPlaces(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): WorkingPlaceList
`;
