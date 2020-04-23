"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.streetType = gql`
    streetType(
        code: String!
    ): StreetType
`;
