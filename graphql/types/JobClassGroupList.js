"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.JobClassGroupList = gql`
	type JobClassGroupList {
		rows: [JobClassGroup]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
