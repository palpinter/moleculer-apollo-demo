"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateJobClassGroup = gql`
    updateJobClassGroup(
        _id: String!, 
        company: String,
        code: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): JobClassGroup
`;
