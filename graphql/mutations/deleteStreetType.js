"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteStreetType = gql`
    deleteStreetType(
        _id: String!
    ): StreetType
`;
