"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteMaritalStatus = gql`
    deleteMaritalStatus(
        _id: String!
    ): MaritalStatus
`;
