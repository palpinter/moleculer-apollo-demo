"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.JobClassList = gql`
	type JobClassList {
		rows: [JobClass]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
