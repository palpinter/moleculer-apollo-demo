"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateGender = gql`
    updateGender(
        _id: String,
        name: String,
    ): Gender
`;
