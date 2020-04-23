"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.LoginResponse = gql`
	type LoginResponse {
		accessToken: String!
		sessionPeriod: Int!
		currentUser: User!
	}
`;
