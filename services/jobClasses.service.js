"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	JOB_CLASS_CREATED,
	JOB_CLASS_UPDATED,
	COMPANY_UPDATED,
} = require("../graphql/constants");
const { JobClass, JobClassList } = require("../graphql/types");
const { jobClass, jobClasses } = require("../graphql/queries");
const {
	createJobClass,
	updateJobClass,
	deleteJobClass,
} = require("../graphql/mutations");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	revision: "number|default:1",
	company: "string|min:3|max:3|decimal:true",
	code: "string|min:4|max:4|decimal:true",
	name: "string",
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
	name: "jobClasses",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("jobClasses")],

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
			"company",
			"code",
			"name",
			"validFrom",
			"validTo",
			"createdAt",
			"createdBy",
			"modifiedAt",
			"modifiedBy",
			"isDeleted",
		],

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
			 * Jobclass type definition
			 */
			type: [JobClass, JobClassList],

			/**
			 * GraphQL resolvers for embedded types
			 */
			resolvers: {
				/**
				 * Get owner company's data
				 */
				JobClass: {
					company: {
						action: "companies.read",
						rootParams: {
							company: "code",
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
				ctx.params.code = await this.getNextFreeCode(4);
			},
		},
		after: {
			async create(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: JOB_CLASS_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: JOB_CLASS_UPDATED,
					code: res.code,
				});
				return res;
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		create: {
			graphql: {
				mutation: createJobClass,
			},
		},
		read: {
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: jobClass,
				subscription: jobClass,
				tags: [JOB_CLASS_UPDATED, COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateJobClass,
			},
		},
		delete: {
			graphql: {
				mutation: deleteJobClass,
			},
		},
		list: {
			graphql: {
				query: jobClasses,
				subscription: jobClasses,
				tags: [JOB_CLASS_CREATED, JOB_CLASS_UPDATED, COMPANY_UPDATED],
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
					company: "001",
					code: "0001",
					name: "szoftverfejlesztő",
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
					company: "001",
					code: "0002",
					name: "ügyfélszolgálatos",
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
		await this.adapter.collection.createIndex(
			{ code: 1 },
			{ unique: true }
		);
		await this.adapter.collection.createIndex(
			{ name: 1 },
			{ unique: true }
		);
	},
	async started() {},
};
