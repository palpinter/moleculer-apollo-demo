"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateContractTerminationType = gql`
    updateContractTerminationType(
        _id: String!, 
        name: String
    ): ContractTerminationType
`;
