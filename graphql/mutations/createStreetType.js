"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createStreetType = gql`
    createStreetType(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): StreetType
`;
