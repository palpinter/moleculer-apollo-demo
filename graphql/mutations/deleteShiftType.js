"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteShiftType = gql`
    deleteShiftType(
        _id: String!
    ): ShiftType
`;
