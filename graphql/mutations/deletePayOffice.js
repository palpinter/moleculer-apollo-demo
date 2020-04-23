"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.deletePayOffice = gql`
    deletePayOffice(
        _id: String!
    ): PayOffice
`;
