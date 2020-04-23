"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteJobClassGroup = gql`
    deleteJobClassGroup(
        _id: String!
    ): JobClassGroup
`;
