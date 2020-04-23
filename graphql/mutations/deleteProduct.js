"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteProduct = gql`
    deleteProduct(
        _id: String!
    ): Product
`;
