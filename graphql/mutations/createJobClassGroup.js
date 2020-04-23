"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createJobClassGroup = gql`
    createJobClassGroup(
        company: String!,
        code: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): JobClassGroup
`;
