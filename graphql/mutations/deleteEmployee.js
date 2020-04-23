"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteEmployee = gql`
    deleteEmployee(
        _id: String!
    ): Employee
`;
