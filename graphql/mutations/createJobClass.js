"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createJobClass = gql`
    createJobClass(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): JobClass
`;
