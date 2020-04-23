"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updatePayOffice = gql`
    updatePayOffice(
        _id: String!, 
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): PayOffice
`;
