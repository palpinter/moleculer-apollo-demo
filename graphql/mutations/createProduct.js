"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createProduct = gql`
    createProduct(
        company: String!,
        code: String!,
        name: String!,
        subscription: Boolean!,
        validFrom: Date!,
        validTo: Date
    ): Product
`;
