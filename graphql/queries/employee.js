"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.employee = gql`
	employee(
		code: String!
	): Employee
`;
