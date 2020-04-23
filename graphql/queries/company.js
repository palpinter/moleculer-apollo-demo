"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.company = gql`
    company(
        code: String!
    ): Company
`;
