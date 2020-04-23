"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	SITE_CREATED,
	SITE_UPDATED,
	COMPANY_UPDATED,
} = require("../graphql/constants");
const { Site, SiteList } = require("../graphql/types");
const { site, sites } = require("../graphql/queries");
const { createSite, updateSite, deleteSite } = require("../graphql/mutations");

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
	name: "sites",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("sites")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "site",
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
			type: [Site, SiteList],
			resolvers: {
				Site: {
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
			after: {
				async create(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: SITE_CREATED,
					});
					return res;
				},
				async update(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: SITE_UPDATED,
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
				mutation: createSite,
			},
		},
		read: {
			auth: true,
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: site,
				subscription: site,
				tags: [SITE_UPDATED, COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateSite,
			},
		},
		delete: {
			graphql: {
				mutation: deleteSite,
			},
		},
		list: {
			graphql: {
				query: sites,
				subscription: sites,
				tags: [SITE_CREATED, SITE_UPDATED, COMPANY_UPDATED],
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
					name: "1. sz. telephely",
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
					name: "2. sz. telephely",
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
	},
	async started() {},
};
