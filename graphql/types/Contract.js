"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.Contract = gql`
	type Contract {
		_id: String!
		revision: Int
		code: String!
		employee: Employee!
		company: Company!
		orgUnit: OrgUnit!
		payOffice: PayOffice!
		workingPlace: WorkingPlace!
		jobClass: JobClass!
		jobClassGroup: JobClassGroup
		typeOfContract: ContractType!
		shiftType: ShiftType!
		maxOvertimeInHour: String
		employmentType: EmploymentType!
		startOfContract: Date!
		endOfContract: Date
		contractTerminationType: ContractTerminationType
		createdAt: Date!
		createdBy: String!
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean!
		roles: [String]
	}
`;
