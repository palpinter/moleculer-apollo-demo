"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.gender = gql`
    gender(
        code: String!
    ): Gender
`;
