"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteEmploymentType = gql`
    deleteEmplyomentType(
        _id: String!
    ): EmploymentType
`;
