"use strict";

const jwt = require("jsonwebtoken");
const moment = require("moment");
const { MoleculerError } = require("moleculer").Errors;
const DbMixin = require("../mixins/db.mixin");
const AuthMixin = require("../mixins/auth.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const codeLength = 10;

const entitySchema = {
	revision: "number|default:1",
	employee: `string|min:${codeLength}|max:${codeLength}|decimal:true`,
	username: "string",
	accessToken: "string",
	refreshToken: "string",
	createdAt: "date|convert:true",
	createdBy: "string",
	modifiedAt: "date|convert:true|optional:true",
	modifiedBy: "string|optional:true",
	isDeleted: "boolean|default:false",
};

module.exports = {
	name: "sessions",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("session"), AuthMixin],

	/**
	 * Settings
	 */
	settings: {
		entityName: "session",
		// Available fields in the responses
		fields: [
			"_id",
			"revision",
			"employee",
			"username",
			"createdAt",
			"createdBy",
			"modifiedAt",
			"modifiedBy",
			"isDeleted",
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: entitySchema,
		entityRevisions: true,
	},

	/**
	 * Action Hooks
	 */
	hooks: {},

	/**
	 * Actions
	 */
	actions: {
		saveSession: {
			params: {
				username: "string",
				employee: "string",
			},
			async handler(ctx) {
				let { username, employee } = ctx.params;

				let properties = await this.getProperties(ctx);
				console.log({ properties });
				let accessToken = this.signKey(
					employee,
					parseInt(properties.defaultAccessTokenPeriod.value),
					properties.accessTokenSecret.value
				);
				let refreshToken = this.signKey(
					employee,
					parseInt(properties.defaultRefreshTokenPeriod.value),
					properties.refreshTokenSecret.value
				);

				let expirationDate = moment()
					.add(properties.defaultRefreshTokenPeriod.value, "minutes")
					.utc();

				let date = new Date();
				let record = {
					revision: 1,
					username,
					employee,
					accessToken,
					refreshToken,
					createdAt: date,
					createdBy: employee,
					isDeleted: false,
				};
				let isSaved = await this.actions.create(record);
				if (isSaved) {
					return {
						accessToken,
						refreshToken,
						expirationDate,
						sessionPeriod: parseInt(
							properties.defaultRefreshTokenPeriod.value
						),
					};
				}
			},
		},
		resolveToken: {
			params: {
				token: "string",
			},
			async handler(ctx) {
				let currentSession;
				currentSession = await this.adapter.findOne({
					accessToken: ctx.params.token,
				});
				if (!currentSession) {
					throw new MoleculerError(
						"Invalid access token!",
						401,
						"INVALID_ACCESS_TOKEN"
					);
				}

				let properties = await this.getProperties(ctx);

				let isAccessTokenValid = this.decodeKey(
					ctx.params.token,
					properties.accessTokenSecret.value
				);
				if (!isAccessTokenValid) {
					let isRefreshTokenValid = this.decodeKey(
						currentSession.refreshToken,
						properties.refreshTokenSecret.value
					);
					if (isRefreshTokenValid) {
						throw new MoleculerError(
							"Client needs to refresh the tokens!",
							401,
							"REFRESH_TOKEN"
						);
					}
					throw new MoleculerError(
						"All tokens are expired!",
						401,
						"ALL_TOKENS_EXPIRED"
					);
				}

				return await ctx.call("users.read", {
					employee: currentSession.employee,
				});
			},
		},
		refreshToken: {
			params: {
				refreshToken: "string",
			},
			graphql: {
				mutation:
					"refreshToken(refreshToken: String!): RefreshTokenResponse",
			},
			async handler(ctx) {
				let refreshToken = ctx.params.refreshToken;
				let currentUser = await this.findOne({
					refreshToken,
				});
				if (!currentUser) {
					throw new MoleculerError(
						"This refresh token is invalid!",
						401,
						"INVALID_REFRESH_TOKEN"
					);
				}
				let properties = await this.getProperties(ctx);

				let isRefreshTokenValid = this.decodeKey(
					refreshToken,
					properties.refreshTokenSecret.value
				);

				if (!isRefreshTokenValid) {
					throw new MoleculerError(
						"This refresh token is invalid!",
						401,
						"INVALID_REFRESH_TOKEN"
					);
				}

				currentUser.accessToken = this.signKey(
					currentUser.employee,
					parseInt(properties.defaultAccessTokenPeriod.value),
					properties.accessTokenSecret.value
				);
				currentUser.refreshToken = this.signKey(
					currentUser.employee,
					parseInt(properties.defaultRefreshTokenPeriod.value),
					properties.refreshTokenSecret.value
				);
				await this.actions.updateWithoutRevision(currentUser);

				let expirationDate = moment()
					.add(properties.defaultRefreshTokenPeriod.value, "minutes")
					.utc();

				ctx.meta.$responseHeaders = {
					"Set-Cookie": `refreshToken=${currentUser.refreshToken}; Expires=${expirationDate}; HTTPOnly`,
				};

				return {
					data: {
						accessToken: currentUser.accessToken,
						sessionPeriod: parseInt(
							properties.defaultRefreshTokenPeriod.value
						),
					},
				};
			},
		},
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
		async seedDB() {},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		/**
		 * Create necessary indexes
		 */
		await this.adapter.collection.createIndex({ username: 1 });
	},
};
