"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createContract = gql`
    createContract(
        employee: String!,
        company: String!,
        orgUnit: String!,
        payOffice: String!,
        workingPlace: String!,
        jobClass: String!,
        jobClassGroup: String!,
        typeOfContract: String!,
        shiftType: String!,
        maxOvertimeInHour: String!,
        employmentType: String!,
        startOfContract: Date!,
        endOfContract: Date,
        contractTerminationType: String!
    ): Contract
`;
