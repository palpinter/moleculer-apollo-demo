"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deleteSite = gql`
    deleteSite(
        _id: String!
    ): Site
`;
