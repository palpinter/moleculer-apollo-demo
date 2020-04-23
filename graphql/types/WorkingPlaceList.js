"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.WorkingPlaceList = gql`
	type WorkingPlaceList {
		rows: [WorkingPlace]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
