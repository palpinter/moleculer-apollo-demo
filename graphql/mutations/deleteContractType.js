"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteContractType = gql`
    deleteContractType(
        _id: String!
    ): ContractType
`;
