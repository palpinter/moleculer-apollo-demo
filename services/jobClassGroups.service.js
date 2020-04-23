"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	JOB_CLASS_GROUP_CREATED,
	JOB_CLASS_GROUP_UPDATED,
	COMPANY_UPDATED,
} = require("../graphql/constants");
const { JobClassGroup, JobClassGroupList } = require("../graphql/types");
const { jobClassGroup, jobClassGroups } = require("../graphql/queries");
const {
	createJobClassGroup,
	updateJobClassGroup,
	deleteJobClassGroup,
} = require("../graphql/mutations");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
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
	name: "jobClassGroups",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("jobClassGroups")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "jobClassGroup",
		// Available fields in the responses
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

		// Validator for the `create` & `insert` actions.
		entityValidator: entitySchema,
		entityRevisions: true,
		graphql: {
			type: [JobClassGroup, JobClassGroupList],
			resolvers: {
				JobClassGroup: {
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
					tag: JOB_CLASS_GROUP_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: JOB_CLASS_GROUP_UPDATED,
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
				mutation: createJobClassGroup,
			},
		},
		read: {
			auth: true,
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: jobClassGroup,
				subscription: jobClassGroup,
				tags: [JOB_CLASS_GROUP_UPDATED, COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateJobClassGroup,
			},
		},
		delete: {
			graphql: {
				mutation: deleteJobClassGroup,
			},
		},
		list: {
			graphql: {
				query: jobClassGroups,
				subscription: jobClassGroups,
				tags: [
					JOB_CLASS_GROUP_CREATED,
					JOB_CLASS_GROUP_UPDATED,
					COMPANY_UPDATED,
				],
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
					name: "informatikusok",
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
					name: "irodai dolgozók",
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
