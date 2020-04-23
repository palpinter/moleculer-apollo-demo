"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteJobClass = gql`
    deleteJobClass(
        _id: String!
    ): JobClass
`;
