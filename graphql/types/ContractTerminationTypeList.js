"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ContractTerminationTypeList = gql`
	type ContractTerminationTypeList {
		rows: [ContractTerminationType]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
