"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createPayOffice = gql`
    createPayOffice(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): PayOffice
`;
