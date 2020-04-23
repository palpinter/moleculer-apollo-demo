"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateStreetType = gql`
    updateStreetType(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): StreetType
`;
