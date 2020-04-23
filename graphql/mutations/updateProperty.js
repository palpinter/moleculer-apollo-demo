"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateProperty = gql`
    updateProperty(
        resource: String,
        resourceId: String,
        key: String,
        value: String
    ): Property
`;
