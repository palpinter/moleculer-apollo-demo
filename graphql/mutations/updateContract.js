"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateContract = gql`
    updateContract(
        orgUnit: String,
        payOffice: String,
        workingPlace: String,
        jobClass: String,
        jobClassGroup: String,
        typeOfContract: String,
        shiftType: String,
        maxOvertimeInHour: String,
        employmentType: String,
        startOfContract: Date,
        endOfContract: Date,
        contractTerminationType: String
    ): Contract
`;
