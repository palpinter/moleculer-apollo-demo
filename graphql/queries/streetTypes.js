"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.streetTypes = gql`
    streetTypes: [StreetType]
`;
