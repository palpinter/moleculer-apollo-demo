"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createGender = gql`
    createGender(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): Gender
`;
