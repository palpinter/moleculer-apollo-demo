"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateProduct = gql`
    updateProduct(
        _id: String!, 
        company: String,
        code: String,
        name: String,
        subscription: Boolean,
        validFrom: Date,
        validTo: Date
    ): Product
`;
