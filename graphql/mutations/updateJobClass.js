"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateJobClass = gql`
    updateJobClass(
        _id: String!, 
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): JobClass
`;
