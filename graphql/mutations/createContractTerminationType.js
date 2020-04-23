"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createContractTerminationType = gql`
    createContractTerminationType(
        name: String!
    ): ContractTerminationType
`;
