"use strict";

const { MoleculerError } = require("moleculer").Errors;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	revision: "number|default:1",
	username: "string",
	password: "string",
	isTemp: "boolean",
	validFrom: "date|convert:true",
	validTo: "date|convert:true|optional:true",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "passwords",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("passwords")],

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
			"username",
			"password",
			"isTemp",
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
	},

	/**
	 * Actions
	 */
	actions: {
		createTemporaryPassword: {
			params: {
				username: entitySchema.username,
			},
			async handler(ctx) {
				let { username } = ctx.params;
				let record = await this.adapter.findOne({ username: username });
				if (!record) {
					throw new MoleculerError(
						"Entity not found!",
						404,
						"ENTITY_NOT_FOUND",
						{
							username,
						}
					);
				}

				// új temporary jelszó generálása
				let temporaryPassword = crypto.randomBytes(4).toString("hex");
				console.log(temporaryPassword);
			},
		},
		isPasswordValid: {
			params: {
				username: "string",
				password: "string",
			},
			async handler(ctx) {
				let username = ctx.params.username;
				let password = ctx.params.password;
				let user = await this.adapter.findOne({
					username,
					isDeleted: false,
				});
				if (!user) {
					return false;
				}
				return await bcrypt.compare(password, user.password);
			},
		},
		changePassword: {
			params: {
				oldPassword: "string",
				newPassword: "string",
			},
			graphql: {
				mutation:
					"changePassword(oldPassword: String!, newPassword: String): Boolean",
			},
			async handler(ctx) {
				let { username } = ctx.meta.user;
				let { oldPassword, newPassword } = ctx.params;

				let record = await this.adapter.findOne({ username: username });

				let oldPasswordIsOK = await bcrypt.compare(
					oldPassword,
					record.password
				);

				if (oldPasswordIsOK) {
					let encryptedNewPassword = await bcrypt.hash(
						newPassword,
						8
					);
					await this.actions.update({
						_id: record._id,
						password: encryptedNewPassword,
					});
					return true;
				}
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
			let passwordOwadmin = await bcrypt.hash("redblod", 8);
			let passwordTmaria = await bcrypt.hash("alma", 8);
			await this.adapter.insertMany([
				{
					revision: 1,
					username: "owadmin",
					password: passwordOwadmin,
					isTemp: true,
					validFrom: DATE,
					validTo: null,
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: null,
					modifiedBy: null,
					isDeleted: false,
				},
				{
					revision: 1,
					username: "tmaria",
					password: passwordTmaria,
					isTemp: false,
					validFrom: DATE,
					validTo: null,
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					modifiedAt: null,
					modifiedBy: null,
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
			{ username: 1 },
			{ unique: true }
		);
	},
	async started() {},
};
