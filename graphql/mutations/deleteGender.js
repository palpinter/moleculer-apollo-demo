"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteGender = gql`
    deleteGender(
        _id: String!
    ): Gender
`;
