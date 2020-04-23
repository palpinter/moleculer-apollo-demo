"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createContractType = gql`
    createContractType(
        name: String!
    ): ContractType
`;
