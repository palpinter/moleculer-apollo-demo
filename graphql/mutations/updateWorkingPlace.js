"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateWorkingPlace = gql`
    updateWorkingPlace(
        site: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): WorkingPlace
`;
