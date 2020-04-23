"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateEmploymentType = gql`
    updateEmploymentType(
        _id: String!, 
        name: String
    ): EmploymentType
`;
