"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Phone = gql`
	type Phone {
		type: String!
		number: String!
	}
`;
