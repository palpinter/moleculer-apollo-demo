"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.maritalStatus = gql`
    maritalStatus(
        code: String!
    ): MaritalStatus
`;
