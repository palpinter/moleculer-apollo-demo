"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createWorkingPlace = gql`
    createWorkingPlace(
        site: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): WorkingPlace
`;
