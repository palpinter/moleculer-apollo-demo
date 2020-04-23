"use strict";

const DbMixin = require("../mixins/db.mixin");
const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const { moleculerGql: gql } = require("moleculer-apollo-server");
const {
	createContract,
	updateContract,
	deleteContract,
} = require("../graphql/mutations");
const { Contract, ContractList } = require("../graphql/types");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const entitySchema = {
	revision: "number|default:1",
	code: "string|min:5|max:5|decimal:true",
	employee: "string|min:10|max:10|decimal:true",
	company: "string|min:3|max:3|decimal:true",
	orgUnit: "string|min:4|max:4|decimal:true",
	payOffice: "string|min:4|max:4|decimal:true",
	workingPlace: "string|min:4|max:4|decimal:true",
	jobClass: "string|min:4|max:4|decimal:true",
	jobClassGroup: "string|min:4|max:4|decimal:true",
	typeOfContract: "string|min:1|max:1|decimal:true",
	shiftType: "string|min:4|max:4|decimal:true",
	maxOverTimeInHour: "string|decimal:true",
	employmentType: "string|min:4|max:4|decimal:true",
	startOfContract: "date|convert:true",
	endOfContract: "date|convert:true|optional:true",
	contractTerminationTypeCode: "string|min:4|max:4|decimal:true",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "contracts",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("contracts")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "contract",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"code",
			"company",
			"employee",
			"orgUnit",
			"payOffice",
			"workingPlace",
			"jobClass",
			"jobClassGroup",
			"typeOfContract",
			"shiftType",
			"maxOvertimeInHour",
			"employmentType",
			"startOfContract",
			"endOfContract",
			"contractTerminationType",
			"createdAt",
			"createdBy",
			"modifiedAt",
			"modifiedBy",
			"isDeleted",
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: entitySchema,
		entityRevisions: true,
		graphql: {
			type: [Contract, ContractList],
			resolvers: {
				Contract: {
					employee: {
						action: "employees.read",
						rootParams: {
							employee: "code",
						},
					},
					company: {
						action: "companies.read",
						rootParams: {
							company: "code",
						},
					},
					orgUnit: {
						action: "orgUnits.read",
						rootParams: {
							orgUnit: "code",
						},
					},
					payOffice: {
						action: "payOffices.read",
						rootParams: {
							payOffice: "code",
						},
					},
					workingPlace: {
						action: "workingPlaces.read",
						rootParams: {
							workingPlace: "code",
						},
					},
					jobClass: {
						action: "jobClasses.read",
						rootParams: {
							jobClass: "code",
						},
					},
					jobClassGroup: {
						action: "jobClassGroups.read",
						rootParams: {
							jobClassGroup: "code",
						},
					},
					typeOfContract: {
						action: "contractTypes.read",
						rootParams: {
							typeOfContract: "code",
						},
					},
					shiftType: {
						action: "shiftTypes.read",
						rootParams: {
							shiftType: "code",
						},
					},
					employmentType: {
						action: "employmentTypes.read",
						rootParams: {
							employmentType: "code",
						},
					},
					contractTerminationType: {
						action: "contractTerminationTypes.read",
						rootParams: {
							contractTerminationType: "code",
						},
					},
				},
			},
		},
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			async create(ctx) {
				this.addCreateParams(ctx);
				ctx.params.code = await this.getNextFreeCode(5);
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		create: {
			graphql: {
				mutation: createContract,
			},
		},
		read: {
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: gql`contract(code: String!): Contract`,
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateContract,
			},
		},
		delete: {
			graphql: {
				mutation: deleteContract,
			},
		},
		list: {
			graphql: {
				query: gql`
					contracts(
						page: Int,
						pageSize: Int, 
						sort: String, 
						search: String, 
						searchFields: String): ContractList
					`,
			},
		},
		contractsByEmployee: {
			cache: ["employee"],
			params: {
				employee: entitySchema.employee,
			},
			graphql: {
				query: gql`contractsByEmployee(employee: String!): [Contract]`,
			},
			async handler(ctx) {
				let query = ctx.params;
				query.isDeleted = false;
				let result = await this.adapter.find(query);
				if (result) {
					return Promise.all(
						_.cloneDeep(
							result.map(async (item) => {
								let roles = await ctx.call(
									"roles.getRolesByContract",
									{
										contract: item.code,
									}
								);
								item.roles = roles;
								return item;
							})
						)
					);
				}
				throw new MoleculerError(
					"Entity not found!",
					404,
					"ENTITY_NOT_FOUND"
				);
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			const DATE = new Date();
			await this.adapter.insertMany([
				{
					revision: 1,
					code: "00001",
					employee: "0000000017",
					company: "001",
					orgUnit: "0001",
					payOffice: "0001",
					workingPlace: "0001",
					jobClass: "0001",
					jobClassGroup: "0001",
					typeOfContract: "0001",
					shiftType: "0001",
					maxOverTimeInHour: "0",
					employmentType: "0001",
					startOfContract: DATE,
					endOfContract: "",
					contractTerminationType: "0001",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					code: "00002",
					employee: "0000000017",
					company: "001",
					orgUnit: "0002",
					payOffice: "0001",
					workingPlace: "0001",
					jobClass: "0002",
					jobClassGroup: "0001",
					typeOfContract: "0002",
					shiftType: "0001",
					maxOverTimeInHour: "0",
					employmentType: "0002",
					startOfContract: DATE,
					endOfContract: "",
					contractTerminationType: "0002",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
			]);
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		/**
		 * Create necessary indexes
		 */
		await this.adapter.collection.createIndex(
			{ code: 1 },
			{ unique: true }
		);
	},
};
