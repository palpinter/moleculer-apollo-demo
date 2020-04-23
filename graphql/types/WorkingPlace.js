"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.WorkingPlace = gql`
	type WorkingPlace {
		_id: String!
		revision: Int
		site: Site!
		code: String!
		name: String!
		validFrom: Date!
		validTo: Date
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
	}
`;
