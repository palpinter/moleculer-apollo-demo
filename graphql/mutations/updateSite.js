"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateSite = gql`
    updateSite(
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): Site
`;
