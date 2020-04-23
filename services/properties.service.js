"use strict";

const DbMixin = require("../mixins/db.mixin");
const { PROPERTY_CREATED, PROPERTY_UPDATED } = require("../graphql/constants");
const { Property, PropertyList } = require("../graphql/types");
const {
	createProperty,
	updateProperty,
	deleteProperty,
} = require("../graphql/queries");
const { property, properties } = require("../graphql/mutations");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const entitySchema = {
	revision: "number|default:1",
	resource: "string",
	resourceId: "string|optional:true",
	key: "string",
	value: "string",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "properties",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("properties")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "property",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"resource",
			"resourceId",
			"key",
			"value",
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
			type: [Property, PropertyList],
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
			},
		},
		after: {
			async create(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: PROPERTY_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: PROPERTY_UPDATED,
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
				mutation: createProperty,
			},
		},
		read: {
			auth: true,
			cache: ["resource", "resourceId", "key"],
			params: {
				resource: entitySchema.resource,
				resourceId: entitySchema.resourceId,
				key: entitySchema.key,
			},
			graphql: {
				query: property,
				subscription: property,
				tags: [PROPERTY_CREATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateProperty,
			},
		},
		delete: {
			graphql: {
				mutation: deleteProperty,
			},
		},
		list: {
			graphql: {
				query: properties,
				subscription: properties,
				tags: [PROPERTY_CREATED, PROPERTY_UPDATED],
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
					resource: this.settings.systemAccountCode,
					resourceId: "",
					key: "defaultRefreshTokenPeriod",
					value: "1000",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					isDeleted: false,
				},
				{
					revision: 1,
					resource: this.settings.systemAccountCode,
					resourceId: "",
					key: "defaultAccessTokenPeriod",
					value: "500",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					isDeleted: false,
				},
				{
					revision: 1,
					resource: this.settings.systemAccountCode,
					resourceId: "",
					key: "accessTokenSecret",
					value: "5e4f9d086613a92fd021395b",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					isDeleted: false,
				},
				{
					revision: 1,
					resource: this.settings.systemAccountCode,
					resourceId: "",
					key: "refreshTokenSecret",
					value: "5e4f9a5f6613a92fd0213959",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
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
			{ key: 1, resource: 1, resourceId: 1 },
			{ unique: true }
		);
	},
	async started() {},
};
