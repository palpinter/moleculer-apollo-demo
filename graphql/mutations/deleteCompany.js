"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteCompany = gql`
    deleteCompany(
        _id: String!
    ): Company
`;
