"use strict";

const fs = require("fs");
const _ = require("lodash");
const ApiGateway = require("moleculer-web");
const { ApolloService } = require("moleculer-apollo-server");
const { moleculerGql: gql } = require("moleculer-apollo-server");
const { Kind } = require("graphql");
const AuthMixin = require("../mixins/auth.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [
		ApiGateway,
		ApolloService({
			// Global GraphQL typeDefs
			// eslint-disable-next-line
			typeDefs: [
				gql`
					scalar Date
				`,
				gql`
					scalar Timestamp
				`,
			],

			// Global resolvers
			resolvers: {
				Date: {
					__parseValue(value) {
						return new Date(value); // value from the client
					},
					__serialize(value) {
						return value; // value sent to the client
					},
					__parseLiteral(ast) {
						if (ast.kind === Kind.INT) {
							return parseInt(ast.value, 10); // ast value is always in string format
						}

						return null;
					},
				},
				Timestamp: {
					__parseValue(value) {
						return new Date(value); // value from the client
					},
					__serialize(value) {
						return value; // value sent to the client
					},
					__parseLiteral(ast) {
						if (ast.kind === Kind.INT) {
							return parseInt(ast.value, 10); // ast value is always in string format
						}

						return null;
					},
				},
			},

			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: {
					// Configures the Access-Control-Allow-Origin CORS header.
					origin: "*",
					// Configures the Access-Control-Allow-Methods CORS header.
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
					// Configures the Access-Control-Allow-Headers CORS header.
					allowedHeaders: [
						"Origin",
						"X-Requested-With",
						"Content-Type",
						"Accept",
						"Authorization",
					],
					// Configures the Access-Control-Expose-Headers CORS header.
					exposedHeaders: [],
					// Configures the Access-Control-Allow-Credentials CORS header.
					credentials: false,
					// Configures the Access-Control-Max-Age CORS header.
					maxAge: 3600,
				},

				mappingPolicy: "restrict",
				//authentication: true,

				bodyParsers: {
					json: {
						strict: false,
						limit: "10MB",
					},
					urlencoded: {
						extended: true,
						limit: "10MB",
					},
				},
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {
				tracing: true,
				subscriptions: true,
				engine: {
					apiKey: process.env.APOLLO_ENGINE_KEY,
				},
			},
		}),
		AuthMixin,
	],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 9000,

		// Exposed IP
		ip: "0.0.0.0",

		// cors
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: [
				"Origin",
				"X-Requested-With",
				"Content-Type",
				"Accept",
				"Authorization",
			],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600,
		},

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/api",

				whitelist: ["**"],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: false,

				aliases: {
					"POST users/login": "users.login",
					"POST users/refresh-token": "users.refreshToken",
				},

				/** 
				 * Before call hook. You can check the request.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				 * 
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
		onError(req, res, err) {
			// Return with the error as JSON object
			res.setHeader("Content-type", "application/json; charset=utf-8");
			res.writeHead(err.code || 500);

			if (err.code == 422) {
				let o = {};
				err.data.forEach((e) => {
					let field = e.field.split(".").pop();
					o[field] = e.message;
				});

				res.end(JSON.stringify({ errors: o }, null, 2));
			} else {
				const errObj = _.pick(err, [
					"name",
					"message",
					"code",
					"type",
					"data",
				]);
				const error = {
					errors: [errObj],
				};
				res.end(JSON.stringify(error, null, 2));
			}

			this.logResponse(req, res, err ? err.ctx : null);
		},
	},

	methods: {},
	events: {
		"graphql.schema.updated"({ schema }) {
			fs.writeFileSync(
				__dirname + "/generated-schema.gql",
				schema,
				"utf8"
			);
			this.logger.info("GraphQL schema is updated!");
			//this.logger.info("Generated GraphQL schema:\n\n" + schema);
		},
	},
};
