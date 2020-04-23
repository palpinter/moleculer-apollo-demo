"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.RefreshTokenResponse = gql`
	type RefreshTokenResponse {
		accessToken: String!
		sessionPeriod: Int!
	}
`;
