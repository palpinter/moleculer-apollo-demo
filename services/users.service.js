"use strict";

const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { MoleculerError } = require("moleculer").Errors;
const DbMixin = require("../mixins/db.mixin");
const AuthMixin = require("../mixins/auth.mixin");
const {
	User,
	LoginResponse,
	RefreshTokenResponse,
} = require("../graphql/types");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const codeLength = 10;

const entitySchema = {
	revision: "number|default:1",
	employee: `string|min:${codeLength}|max:${codeLength}|decimal:true`,
	username: "string",
	email: "email",
	phone: "string|optional:true",
	validFrom: "date|convert:true|optional:true",
	validTo: "date|convert:true|optional:true",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "users",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("users"), AuthMixin],

	/**
	 * Settings
	 */
	settings: {
		entityName: "user",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"employee",
			"username",
			"email",
			"phone",
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
			type: [User, LoginResponse, RefreshTokenResponse],
			resolvers: {
				User: {
					employee: {
						action: "employees.read",
						rootParams: {
							employee: "code",
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
				ctx.params.revision = 1;
				ctx.params.createdAt = new Date();
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		forgotPassword: {
			rest: {
				method: "POST",
				path: "/forgot-password",
			},
			params: {
				email: "email",
			},
			async handler(ctx) {
				let { email } = ctx.params;
				let user = await this.adapter.findOne({ email: email });
				if (!user) {
					throw new MoleculerError(
						"Entity not found!",
						404,
						"ENTITY_NOT_FOUND",
						{
							email,
						}
					);
				}

				// email küldése
				return {
					status: "EMAIL_SENT",
				};
			},
		},

		login: {
			params: {
				username: "string",
				password: "string",
			},
			graphql: {
				query:
					"login(username: String!, password: String): LoginResponse",
			},
			async handler(ctx) {
				let username = ctx.params.username;
				let password = ctx.params.password;
				let currentUser = await this.adapter.findOne({
					username,
				});
				if (!currentUser) {
					throw new MoleculerError(
						"Invalid access token!",
						401,
						"INVALID_ACCESS_TOKEN"
					);
				}
				let isPasswordValid = await ctx.call(
					"passwords.isPasswordValid",
					{
						username,
						password,
					}
				);

				if (!isPasswordValid) {
					throw new MoleculerError(
						"Wrong password!",
						510,
						"WrongPassword",
						{ username }
					);
				}

				if (currentUser) {
					let cleanedCurrentUser = _.cloneDeep(currentUser);
					await this.actions.updateWithoutRevision(currentUser);

					let sessionData = await ctx.call("sessions.saveSession", {
						username: currentUser.username,
						employee: currentUser.employee,
					});

					delete cleanedCurrentUser.revision;
					delete cleanedCurrentUser.isDeleted;
					delete cleanedCurrentUser.createdAt;
					delete cleanedCurrentUser.createdBy;
					ctx.meta.$responseHeaders = {
						"Set-Cookie": `refreshToken=${sessionData.refreshToken}; Expires=${sessionData.expirationDate}; HTTPOnly`,
					};
					let result = {
						accessToken: sessionData.accessToken,
						sessionPeriod: sessionData.sessionPeriod,
						currentUser: cleanedCurrentUser,
					};
					return result;
				}
			},
		},
		logout: {
			graphql: {
				mutation: "logout: String",
			},
			async handler(ctx) {
				let currentUser = ctx.meta.user;
				currentUser.accessToken = "";
				currentUser.refreshToken = "";
				await this.actions.updateWithoutRevision(currentUser);
				return "OK";
			},
		},
		read: {
			auth: true,
			cache: {
				keys: ["employee"],
			},
			params: {
				employee: entitySchema.employee,
			},
			graphql: {
				query: "user(employee: String!): User",
			},
			async handler(ctx) {
				let employee = ctx.params.employee;
				let result = _.cloneDeep(
					await this.adapter.findOne({
						employee,
						isDeleted: false,
					})
				);
				if (result) {
					delete result.isDeleted;
					delete result.accessToken;
					delete result.refreshToken;
					return result;
				}
				throw new MoleculerError(
					"Entity not found!",
					404,
					"ENTITY_NOT_FOUND",
					{
						employee,
					}
				);
			},
		},

		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */
	},

	/**
	 * Methods
	 */
	methods: {
		signKey(employee, expireInMinutes, secret) {
			return jwt.sign(
				{
					exp: Math.floor(Date.now() / 1000) + 60 * expireInMinutes,
					payload: {
						employee,
					},
				},
				secret
			);
		},
		decodeKey(token, secret) {
			try {
				jwt.verify(token, secret);
				return true;
			} catch (error) {
				return false;
			}
		},
		async getProperties(ctx) {
			return await ctx.mcall({
				defaultRefreshTokenPeriod: {
					action: "properties.read",
					params: {
						resource: this.settings.systemAccountCode,
						key: "defaultRefreshTokenPeriod",
					},
				},
				defaultAccessTokenPeriod: {
					action: "properties.read",
					params: {
						resource: this.settings.systemAccountCode,
						key: "defaultAccessTokenPeriod",
					},
				},
				accessTokenSecret: {
					action: "properties.read",
					params: {
						resource: this.settings.systemAccountCode,
						key: "accessTokenSecret",
					},
				},
				refreshTokenSecret: {
					action: "properties.read",
					params: {
						resource: this.settings.systemAccountCode,
						key: "refreshTokenSecret",
					},
				},
			});
		},
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
					employee: "0000000000",
					username: "owadmin",
					email: "owadmin@orgware.hu",
					phone: null,
					validFrom: DATE,
					validTo: null,
					createdAt: DATE,
					createdBy: this.settings.systemAccountCode,
					isDeleted: false,
				},
				{
					revision: 1,
					employee: "0000000017",
					username: "tmaria",
					email: "pelda.maria@pelda.hu",
					phone: null,
					validFrom: DATE,
					validTo: null,
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
		/**
		 * Create necessary indexes
		 */
		await this.adapter.collection.createIndex(
			{ username: 1 },
			{ unique: true }
		);
	},
};
