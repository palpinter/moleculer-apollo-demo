"use strict";

const DbMixin = require("../mixins/db.mixin");
const { moleculerGql: gql } = require("moleculer-apollo-server");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	revision: "number|default:1",
	contract: "string|min:5|max:5|decimal:true",
	role: "string",
	resource: "string|optional:true",
	resourceId: "string|optional:true",
	validFrom: "date|convert:true",
	validTo: "date|convert:true|optional:true",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	/**
	 * Service name
	 */
	name: "roles",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("roles")],

	/**
	 * Settings
	 */
	settings: {
		/**
		 * Available fields in the responses
		 */
		fields: [
			"_id",
			"revision",
			"contract",
			"role",
			"resource",
			"resourceId",
			"validFrom",
			"validTo",
			"createdAt",
			"createdBy",
			"modifiedAt",
			"modifiedBy",
			"isDeleted",
		],

		/**
		 * Name of a singe entity
		 */
		enitityName: "role",
		/**
		 * Validator for the `create` & `insert` actions.
		 */
		entityValidator: entitySchema,

		/**
		 * Create revision history
		 */
		entityRevisions: true,

		/**
		 * GraqhQL definitions
		 */
		graphql: {
			type: [
				gql`
					type Role {
						_id: String!
						contract: String
						role: String!
						resource: String
						resourceId: String
						validFrom: Date!
						validTo: Date
						createdAt: Date!
						createdBy: String!
						modifiedAt: Date
						modifiedBy: String
						isDeleted: Boolean!
					}
				`,
				gql`
					enum FilterType {
						COMPANY
						WORK_PLACE
						JOB_TYPE_GROUP
						ORG_UNIT
						PAY_OFFICE
						CONTRACT
					}
				`,
			],
		},
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the required fields.
			 *
			 * @param {Context} ctx
			 */
			async create(ctx) {
				ctx.params.revision = 1;
				ctx.params.createdAt = new Date();
				ctx.params.createdBy = ctx.meta.user.employee;
				ctx.params.isDeleted = false;
			},
		},
	},

	/**
	 * Actions
	 * These actions using mixin javascript technology.
	 * These are defined in db-mixins
	 */
	actions: {
		create: {
			graphql: {
				mutation: gql`
					createRole(
                        role: String!,
                        contract: String!
                        resource: String,
                        resourceId: String,
					    validFrom: String!,	
					    validTo: String)
					: Role
					`,
			},
		},
		read: {
			cache: ["_id"],
			params: {
				_id: "string",
			},
			graphql: {
				query: "role(_id: String!): Role",
			},
			async handler(ctx) {
				return await this.actions.get(ctx.params_id);
			},
		},
		update: {
			graphql: {
				mutation: gql`
						updateRole(
							_id: String!, 
							role: String,
							contract: String,
							resource: String,
							resourceId: String,
							validFrom: String, 
							validTo: String): Role
						`,
			},
		},
		delete: {
			graphql: {
				mutation: "deleteRole(_id: String!): Role",
			},
		},
		getRolesByContract: {
			params: {
				contract: entitySchema.contract,
			},
			graphql: {
				query: "rolesByContract(contract: String!): [String]",
			},
			async handler(ctx) {
				return this.adapter.collection.distinct("role", {
					contract: ctx.params.contract,
				});
			},
		},
		getRolesDataByContract: {
			params: {
				contract: entitySchema.contract,
			},
			async handler(ctx) {
				let rolesList = await this.adapter.collection.distinct("role", {
					contract: ctx.params.contract,
				});
				let result = rolesList.map(async (role) => {
					let filter = { role: role };
					let allRoles = await this.actions.find({
						query: { role: role, contract: ctx.params.contract },
					});
					allRoles.map((roleRecord) => {
						if (roleRecord.resource && roleRecord.resourceId) {
							let filterType = roleRecord.resource;
							let filteredItem = roleRecord.resourceId;
							let filterItem = { [filterType]: [filteredItem] };

							if (filter[filterType]) {
								filter[filterType].push(filteredItem);
							} else {
								filter = Object.assign(filter, filterItem);
							}
						}
					});
					return filter;
				});
				return Promise.all(result);
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
					contract: "00001",
					role: "MY_HR_ADMIN",
					resource: "",
					resourceId: "",
					validFrom: DATE,
					validTo: "",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					contract: "00001",
					role: "MY_HR_ADMIN",
					resource: "orgUnit",
					resourceId: "0001",
					validFrom: DATE,
					validTo: "",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					contract: "00001",
					role: "MY_HR_ADMIN",
					resource: "orgUnit",
					resourceId: "0002",
					validFrom: DATE,
					validTo: "",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					contract: "00001",
					role: "MY_HR_ADMIN",
					resource: "payOffice",
					resourceId: "0001",
					validFrom: DATE,
					validTo: "",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					contract: "00002",
					role: "MY_HR_ADMIN",
					resource: "",
					resourceId: "",
					validFrom: DATE,
					validTo: "",
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
		await this.adapter.collection.createIndex({ contract: 1 });
		await this.adapter.collection.createIndex({ role: 1 });
	},
};
