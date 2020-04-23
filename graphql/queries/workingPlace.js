"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.workingPlace = gql`
	workingPlace(
		code: String!
	): WorkingPlace
`;
