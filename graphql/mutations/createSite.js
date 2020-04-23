"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createSite = gql`
    createSite(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): Site
`;
