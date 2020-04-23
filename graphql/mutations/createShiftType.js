"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createShiftType = gql`
    createShiftType(
        name: String!
    ): ShiftType
`;
