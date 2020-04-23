"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.genders = gql`
    genders: [Gender]
`;
