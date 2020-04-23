"use strict";

const DbMixin = require("../mixins/db.mixin");
const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const {
	PRODUCT_CREATED,
	PRODUCT_UPDATED,
	COMPANY_UPDATED,
} = require("../graphql/constants");
const { Product, ProductList } = require("../graphql/types");
const { product, products } = require("../graphql/queries");
const {
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../graphql/mutations");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const entitySchema = {
	revision: "number|default:1",
	company: "string|min:3|max:3|decimal:true",
	code: "string|min:4|max:4|decimal:true",
	name: "string",
	subscription: "boolean|default:false",
	validFrom: "date|convert:true",
	validTo: "date|convert:true|optional:true",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "products",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("products")],

	/**
	 * Settings
	 */
	settings: {
		entityName: "product",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"company",
			"code",
			"name",
			"subscription",
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
			type: [Product, ProductList],
			resolvers: {
				Product: {
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
						tag: PRODUCT_CREATED,
					});
					return res;
				},
				async update(ctx, res) {
					await ctx.broadcast("graphql.publish", {
						tag: PRODUCT_UPDATED,
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
				mutation: createProduct,
			},
		},
		read: {
			auth: true,
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: product,
				subscription: product,
				tags: [PRODUCT_UPDATED, COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateProduct,
			},
		},
		delete: {
			graphql: {
				mutation: deleteProduct,
			},
		},
		list: {
			graphql: {
				query: products,
				subscription: products,
				tags: [PRODUCT_CREATED, PRODUCT_UPDATED, COMPANY_UPDATED],
			},
		},
		modulesByCompany: {
			auth: true,
			cache: ["company"],
			params: {
				company: entitySchema.company,
			},
			graphql: {
				query: "modulesByCompany(company: String!): [Product]",
			},
			async handler(ctx) {
				let query = ctx.params;
				query.isDeleted = false;
				let result = await this.adapter.find(query);

				if (result) {
					return _.cloneDeep(result);
				}
				throw new MoleculerError(
					"Entity not found!",
					404,
					"ENTITY_NOT_FOUND"
				);
			},
		},
		modulesSubscribedByCompany: {
			auth: true,
			cache: ["company"],
			params: {
				company: entitySchema.company,
			},
			graphql: {
				query:
					"productsSubscribedByCompany(company: String!): [Product]",
			},
			async handler(ctx) {
				let query = ctx.params;
				query.isDeleted = false;
				query.subscription = true;
				let result = await this.actions.find({ query: query });
				if (result) {
					return _.cloneDeep(result);
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
					company: "001",
					code: "0001",
					name: "MyTime",
					subscription: false,
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
					name: "MyLeave",
					subscription: true,
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
