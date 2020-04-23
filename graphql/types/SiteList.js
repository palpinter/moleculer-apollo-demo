"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.SiteList = gql`
	type SiteList {
		rows: [Site]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
