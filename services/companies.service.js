"use strict";

const DbMixin = require("../mixins/db.mixin");
const { COMPANY_CREATED, COMPANY_UPDATED } = require("../graphql/constants");
const { company, companies } = require("../graphql/queries");
const {
	createCompany,
	updateCompany,
	deleteCompany,
} = require("../graphql/mutations");
const { Company, CompanyList } = require("../graphql/types");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	revision: "number|default:1",
	code: "string|min:3|max:3|decimal:true",
	name: "string",
	shortName: "string",
	country: "string",
	taxNumber: "string",
	registrationNumber: "string",
	bankAccountNumber: "string",
	IBAN: "string",
	SWIFT: "string",
	logoFile: "string|optional:true",
	lawType: "string",
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
	name: "companies",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("companies")],

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
			"shortName",
			"country",
			"taxNumber",
			"registrationNumber",
			"bankAccountNumber",
			"IBAN",
			"SWIFT",
			"logoFile",
			"lawType",
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
		enitityName: "company",

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
			type: [Company, CompanyList],
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
				ctx.params.code = await this.getNextFreeCode(3);
			},
		},
		after: {
			async create(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: COMPANY_CREATED,
				});
				return res;
			},
			async update(ctx, res) {
				await ctx.broadcast("graphql.publish", {
					tag: COMPANY_UPDATED,
					code: res.code,
				});
				return res;
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
				mutation: createCompany,
			},
		},
		read: {
			cache: ["code"],
			params: {
				code: entitySchema.code,
			},
			graphql: {
				query: company,
				subscription: company,
				tags: [COMPANY_UPDATED],
			},
			async handler(ctx) {
				return await this.findOneByCode(ctx.params);
			},
		},
		update: {
			graphql: {
				mutation: updateCompany,
			},
		},
		delete: {
			graphql: {
				mutation: deleteCompany,
			},
		},
		list: {
			graphql: {
				query: companies,
				subscription: companies,
				tags: [COMPANY_CREATED, COMPANY_UPDATED],
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
					code: "001",
					name: "Orgware Kft.",
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
					code: "002",
					name: "Állami Nyomda",
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
	events: {
		"graphql.publish"(params) {
			this.logger.info("graphql.publish received", params);
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
