"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.maritalStatuses = gql`
    maritalStatuses: [MaritalStatus]
`;
