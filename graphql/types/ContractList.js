"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ContractList = gql`
	type ContractList {
		rows: [Contract]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
