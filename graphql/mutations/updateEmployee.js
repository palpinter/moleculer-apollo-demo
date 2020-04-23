"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.updateEmployee = gql`
    updateEmployee(
        _id: String!, 
        avatar: String,
        prefixName: String,
        lastName: String,
        middleName: String,
        firstName: String,
        forename: String,
        dateOfBirth: Date,
        placeOfBirth: String,
        countryOfBirth: String,
        mothersName: String,
        gender: String,
        maritalStatus: String,
        taxNumber: String,
        socialSecurityNumber: String,
        identityCardNumber: String,
        nationality: String,
        preferredLanguage: String,
        permanentAddress: AddressInput,
        temporaryAddress: AddressInput,
        serviceAddress: AddressInput,
        phones: [PhoneInput],
        emails: [EmailInput],
        validFrom: Date,
        validTo: Date,
    ): Employee
`;
