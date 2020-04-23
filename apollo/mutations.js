"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.createCompany = gql`
    createCompany(
        name: String!,
		shortName: String!
		country: String!
		taxNumber: String!
		registrationNumber: String!
		bankAccountNumber: String!
		IBAN: String!
		SWIFT: String!
		logoFile: String
		lawType: String!
        validFrom: String!,	
        validTo: String
    ): Company
`;

exports.updateCompany = gql`
    updateCompany(
        _id: String!, 
        name: String, 
		shortName: String,
		country: String,
		taxNumber: String,
		registrationNumber: String,
		bankAccountNumber: String,
		IBAN: String,
		SWIFT: String,
		logoFile: String,
		lawType: String,
        validFrom: String, 
        validTo: String)
    : Company
`;

exports.deleteCompany = gql`
    deleteCompany(
        _id: String!
    ): Company
`;

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

exports.deleteContract = gql`
    deleteContract(
        _id: String!
    ): Contract
`;

exports.createContractType = gql`
    createContractType(
        name: String!
    ): ContractType
`;

exports.updateContractType = gql`
    updateContractType(
        _id: String!, 
        name: String
    ): ContractType
`;

exports.deleteContractType = gql`
    deleteContractType(
        _id: String!
    ): ContractType
`;

exports.createContractTerminationType = gql`
    createContractTerminationType(
        name: String!
    ): ContractTerminationType
`;

exports.updateContractTerminationType = gql`
    updateContractTerminationType(
        _id: String!, 
        name: String
    ): ContractTerminationType
`;

exports.deleteContractTerminationType = gql`
    deleteContractTerminationType(
        _id: String!
    ): ContractTerminationType
`;

exports.createGender = gql`
    createGender(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): Gender
`;

exports.updateGender = gql`
    updateGender(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): Gender
`;

exports.deleteGender = gql`
    deleteGender(
        _id: String!
    ): Gender
`;

exports.createMaritalStatus = gql`
    createMaritalStatus(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): MaritalStatus
`;

exports.updateMaritalStatus = gql`
    updateMaritalStatus(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): MaritalStatus
`;

exports.deleteMaritalStatus = gql`
    deleteMaritalStatus(
        _id: String!
    ): MaritalStatus
`;

exports.createEmployee = gql`
    createEmployee(
        prefixName: String,
        lastName: String!,
        middleName: String,
        firstName: String!,
        forename: String,
        dateOfBirth: Date!,
        placeOfBirth: String!,
        countryOfBirth: String!,
        mothersName: String!,
        gender: String!,
        maritalStatus: String!,
        taxNumber: String,
        socialSecurityNumber: String,
        identityCardNumber: String,
        nationality: String!,
        preferredLanguage: String,
        permanentAddress: AddressInput!,
        temporaryAddress: AddressInput,
        serviceAddress: AddressInput,
        phones: [PhoneInput],
        emails: [EmailInput],
        validFrom: Date!,
        validTo: Date,
    ): Employee
`;

exports.updateEmployee = gql`
    updateEmployee(
        _id: String!, 
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

exports.deleteEmployee = gql`
    deleteEmployee(
        _id: String!
    ): Employee
`;

exports.createEmploymentType = gql`
    createEmploymentType(
        name: String!
    ): EmploymentType
`;

exports.updateEmploymentType = gql`
    updateEmploymentType(
        _id: String!, 
        name: String
    ): EmploymentType
`;

exports.deleteEmploymentType = gql`
    deleteEmplyomentType(
        _id: String!
    ): EmploymentType
`;

exports.createJobClass = gql`
    createJobClass(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): JobClass
`;

exports.updateJobClass = gql`
    updateJobClass(
        _id: String!, 
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): JobClass
`;

exports.deleteJobClass = gql`
    deleteJobClass(
        _id: String!
    ): JobClass
`;

exports.createJobClassGroup = gql`
    createJobClassGroup(
        company: String!,
        code: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): JobClassGroup
`;

exports.updateJobClassGroup = gql`
    updateJobClassGroup(
        _id: String!, 
        company: String,
        code: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): JobClassGroup
`;

exports.deleteJobClassGroup = gql`
    deleteJobClassGroup(
        _id: String!
    ): JobClassGroup
`;

exports.createModule = gql`
    createModule(
        company: String!,
        code: String!,
        name: String!,
        subscription: Boolean!,
        validFrom: Date!,
        validTo: Date
    ): Module
`;

exports.updateModule = gql`
    updateModule(
        _id: String!, 
        company: String,
        code: String,
        name: String,
        subscription: Boolean,
        validFrom: Date,
        validTo: Date
    ): Module
`;

exports.deleteModule = gql`
    deleteModule(
        _id: String!
    ): Module
`;

exports.createOrgUnit = gql`
	createOrgUnit(
		company: String!,
		code: String!,
		parent: String,
		name: String!,
		validFrom: Date!,
		validTo: Date
	): OrgUnit
`;

exports.updateOrgUnit = gql`
	updateOrgUnit(
		_id: String!, 
		company: String,
		code: String,
		parent: String,
		name: String,
		validFrom: Date,
		validTo: Date
	): OrgUnit
`;

exports.deleteOrgUnit = gql`
	deleteOrgUnit(
		_id: String!
	): OrgUnit
`;

exports.createPayOffice = gql`
    createPayOffice(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): PayOffice
`;

exports.updatePayOffice = gql`
    updatePayOffice(
        _id: String!, 
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): PayOffice
`;

exports.deletePayOffice = gql`
    deletePayOffice(
        _id: String!
    ): PayOffice
`;

exports.createProperty = gql`
    createProperty(
        resource: String!,
        resourceId: String,
        key: String!,
        value: String!
    ): Property
`;

exports.updateProperty = gql`
    updateProperty(
        resource: String,
        resourceId: String,
        key: String,
        value: String
    ): Property
`;

exports.deleteProperty = gql`
    deleteProperty(
        _id: String!
    ): Property
`;

exports.createShiftType = gql`
    createShiftType(
        name: String!
    ): ShiftType
`;

exports.updateShiftType = gql`
    updateShiftType(
        _id: String!, 
        name: String
    ): ShiftType
`;

exports.deleteShiftType = gql`
    deleteShiftType(
        _id: String!
    ): ShiftType
`;

exports.createWorkingPlace = gql`
    createWorkingPlace(
        site: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): WorkingPlace
`;

exports.updateWorkingPlace = gql`
    updateWorkingPlace(
        site: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): WorkingPlace
`;

exports.deleteWorkingPlace = gql`
    deleteWorkingPlace(
        _id: String!
    ): WorkingPlace
`;

exports.createSite = gql`
    createSite(
        company: String!,
        name: String!,
        validFrom: Date!,
        validTo: Date
    ): Site
`;

exports.updateSite = gql`
    updateSite(
        company: String,
        name: String,
        validFrom: Date,
        validTo: Date
    ): Site
`;

exports.deleteSite = gql`
    deleteSite(
        _id: String!
    ): Site
`;

exports.createStreetType = gql`
    createStreetType(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): StreetType
`;

exports.updateStreetType = gql`
    updateStreetType(
        name: String!,
        validFrom: String!,	
        validTo: String
    ): StreetType
`;

exports.deleteStreetType = gql`
    deleteStreetType(
        _id: String!
    ): StreetType
`;
