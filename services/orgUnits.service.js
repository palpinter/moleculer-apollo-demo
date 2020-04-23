"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	ORG_UNIT_CREATED,
	ORG_UNIT_UPDATED,
	COMPANY_UPDATED,
} = require("../graphql/constants");
const { OrgUnit, OrgUnitList } = require("../graphql/types");
const { orgUnit, orgUnits } = require("../graphql/queries");
const {
	createOrgUnit,
	updateOrgUnit,
	deleteOrgUnit,
} = require("../graphql/mutations");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const entitySchema = {
	revision: "number|default:1",
	company: "string|min:3|max:3|decimal:true",
	parent: "string|min:4|max:4|decimal:true",
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
	name: "orgUnits",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("orgUnits")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "orgUnit",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"company",
			"parent",
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
			type: [OrgUnit, OrgUnitList],
			resolvers: {
				OrgUnit: {
					company: {
						action: "companies.read",
						rootParams: {
							company: "code",
						},
					},
					parent: {
						action: "orgUnits.read",
						rootParams: {
							parent: "code",
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
					tag: ORG_UNIT_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: ORG_UNIT_UPDATED,
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
				mutation: createOrgUnit,
			},
		},
		read: {
			auth: true,
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: orgUnit,
				subscription: orgUnit,
				tags: [ORG_UNIT_UPDATED, COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateOrgUnit,
			},
		},
		delete: {
			graphql: {
				mutation: deleteOrgUnit,
			},
		},
		list: {
			graphql: {
				query: orgUnits,
				subscription: orgUnits,
				tags: [ORG_UNIT_CREATED, ORG_UNIT_UPDATED, COMPANY_UPDATED],
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
					parent: "",
					code: "0001",
					name: "HQ",
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
					parent: "0001",
					code: "0002",
					name: "HQ - Pénzügy",
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
