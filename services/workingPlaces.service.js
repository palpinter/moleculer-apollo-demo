"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	WORKING_PLACE_CREATED,
	WORKING_PLACE_UPDATED,
	SITE_UPDATED,
} = require("../graphql/constants");
const { WorkingPlace, WorkingPlaceList } = require("../graphql/types");
const { workingPlace, workingPlaces } = require("../graphql/queries");
const {
	createWorkingPlace,
	updateWorkingPlace,
	deleteWorkingPlace,
} = require("../graphql/mutations");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const entitySchema = {
	revision: "number|default:1",
	site: "string|min:3|max:3|decimal:true",
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
	name: "workingPlaces",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("workingPlaces")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "workingPlace",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"site",
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
			type: [WorkingPlace, WorkingPlaceList],
			resolvers: {
				WorkingPlace: {
					site: {
						action: "sites.read",
						rootParams: {
							site: "code",
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
			after: {
				async create(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: WORKING_PLACE_CREATED,
					});
					return res;
				},
				async update(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: WORKING_PLACE_UPDATED,
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
				mutation: createWorkingPlace,
			},
		},
		read: {
			auth: true,
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: workingPlace,
				subscription: workingPlace,
				tags: [WORKING_PLACE_UPDATED, SITE_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateWorkingPlace,
			},
		},
		delete: {
			graphql: {
				mutation: deleteWorkingPlace,
			},
		},
		list: {
			graphql: {
				query: workingPlaces,
				subscription: workingPlaces,
				tags: [
					WORKING_PLACE_CREATED,
					WORKING_PLACE_UPDATED,
					SITE_UPDATED,
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
					site: "0001",
					code: "0001",
					name: "1. sz. munkahely",
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
					site: "0001",
					code: "0002",
					name: "2. sz. munkahely",
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
			{ code: 1, name: 1 },
			{ unique: true }
		);
		await this.adapter.collection.createIndex(
			{ site: 1, code: 1 },
			{ unique: true }
		);
	},
	async started() {},
};
