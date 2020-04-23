"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteContract = gql`
    deleteContract(
        _id: String!
    ): Contract
`;
