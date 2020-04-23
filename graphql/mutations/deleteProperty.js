"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteProperty = gql`
    deleteProperty(
        _id: String!
    ): Property
`;
