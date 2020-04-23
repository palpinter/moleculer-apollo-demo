"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.shiftType = gql`
	shiftType(
		code: String!
	): ShiftType
`;
