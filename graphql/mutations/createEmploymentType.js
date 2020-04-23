"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createEmploymentType = gql`
    createEmploymentType(
        name: String!
    ): EmploymentType
`;
