"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.sites = gql`
	sites(
		page: Int, 
		pageSize: Int, 
		sort: String, 
		search: String, 
		searchFields: String
	): SiteList
`;
