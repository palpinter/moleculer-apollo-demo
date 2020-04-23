"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createProperty = gql`
    createProperty(
        resource: String!,
        resourceId: String,
        key: String!,
        value: String!
    ): Property
`;
