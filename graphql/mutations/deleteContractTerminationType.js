"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteContractTerminationType = gql`
    deleteContractTerminationType(
        _id: String!
    ): ContractTerminationType
`;
