"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.employmentType = gql`
	emplyomentType(
		code: String!
	): EmploymentType
`;
