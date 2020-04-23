"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteWorkingPlace = gql`
    deleteWorkingPlace(
        _id: String!
    ): WorkingPlace
`;
