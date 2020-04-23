"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateShiftType = gql`
    updateShiftType(
        _id: String!, 
        name: String
    ): ShiftType
`;
