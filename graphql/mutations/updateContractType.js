"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateContractType = gql`
    updateContractType(
        _id: String!, 
        name: String
    ): ContractType
`;
