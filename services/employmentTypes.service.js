"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	EMPLOYMENT_TYPE_CREATED,
	EMPLOYMENT_TYPE_UPDATED,
} = require("../graphql/constants");
const { EmploymentType, EmploymentTypeList } = require("../graphql/types");
const { employmentType, employmentTypes } = require("../graphql/queries");
const {
	createEmploymentType,
	updateEmploymentType,
	deleteEmploymentType,
} = require("../graphql/mutations");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	revision: "number|default:1",
	code: "string|min:4|max:4|decimal:true",
	name: "string",
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
	name: "employmentTypes",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("employmentTypes")],

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
			"code",
			"name",
			"createdAt",
			"createdBy",
			"modifiedAt",
			"modifiedBy",
			"isDeleted",
		],

		/**
		 * Name of a singe entity
		 */
		enitityName: "employmentType",
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
			/**
			 * Company type definition
			 */
			type: [EmploymentType, EmploymentTypeList],
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
				this.addCreateParams(ctx);
				ctx.params.code = await this.getNextFreeCode(4);
			},
			after: {
				async create(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: EMPLOYMENT_TYPE_CREATED,
					});
					return res;
				},
				async update(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: EMPLOYMENT_TYPE_UPDATED,
						code: res.code,
					});
					return res;
				},
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		create: {
			graphql: {
				mutation: createEmploymentType,
			},
		},
		read: {
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: employmentType,
				subscription: employmentType,
				tags: [EMPLOYMENT_TYPE_CREATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateEmploymentType,
			},
		},
		delete: {
			graphql: {
				mutation: deleteEmploymentType,
			},
		},
		list: {
			graphql: {
				query: employmentTypes,
				subscription: employmentTypes,
				tags: [EMPLOYMENT_TYPE_CREATED, EMPLOYMENT_TYPE_UPDATED],
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
					code: "0001",
					name: "1. sz employment type",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					code: "0002",
					name: "2. sz emplyoment type",
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
		await this.adapter.collection.createIndex(
			{ name: 1 },
			{ unique: true }
		);
	},
};
