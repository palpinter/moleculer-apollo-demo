"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ContractTypeList = gql`
	type ContractTypeList {
		rows: [ContractType]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
