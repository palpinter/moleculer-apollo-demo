"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateMaritalStatus = gql`
    updateMaritalStatus(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): MaritalStatus
`;
