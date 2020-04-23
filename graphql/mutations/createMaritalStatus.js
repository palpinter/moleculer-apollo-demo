"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createMaritalStatus = gql`
    createMaritalStatus(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): MaritalStatus
`;
