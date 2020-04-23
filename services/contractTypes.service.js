"use strict";

const DbMixin = require("../mixins/db.mixin");
const {
	CONTRACT_TYPE_CREATED,
	CONTRACT_TYPE_UPDATED,
} = require("../graphql/constants");
const { ContractType, ContractTypeList } = require("../graphql/types");
const { contractType, contractTypes } = require("../graphql/queries");
const {
	createContractType,
	updateContractType,
	deleteContractType,
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
	name: "contractTypes",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("contractTypes")],

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
		enitityName: "contractType",
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
			type: [ContractType, ContractTypeList],
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
		},
		after: {
			async create(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: CONTRACT_TYPE_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: CONTRACT_TYPE_UPDATED,
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
				mutation: createContractType,
			},
		},
		read: {
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: contractType,
				subscription: contractType,
				tags: [CONTRACT_TYPE_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateContractType,
			},
		},
		delete: {
			graphql: {
				mutation: deleteContractType,
			},
		},
		list: {
			graphql: {
				query: contractTypes,
				subscription: contractTypes,
				tags: [CONTRACT_TYPE_CREATED, CONTRACT_TYPE_UPDATED],
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
					name: "Főállású munkaviszony",
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: "",
					modifiedBy: "",
					isDeleted: false,
				},
				{
					revision: 1,
					code: "0002",
					name: "Részmunkaidő",
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
