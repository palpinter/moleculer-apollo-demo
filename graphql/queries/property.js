"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.property = gql`
	property(resource: String!, resourceId: String, key: String): Property
`;
