"use strict";

const { MoleculerError } = require("moleculer").Errors;
const gql = require("graphql-tag");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// pass authentication on login and refreshToken actions
			let obj = gql`
				${req.body.query}
			`;
			if (
				obj.definitions[0].selectionSet.selections[0].name.value ===
					"login" ||
				obj.definitions[0].selectionSet.selections[0].name.value ===
					"refreshToken" ||
				obj.definitions[0].selectionSet.selections[0].name.value ===
					"logout"
			) {
				return null;
			}
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				let currentUser = await ctx.call("sessions.resolveToken", {
					token,
				});

				return (ctx.meta.user = currentUser);
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				throw new MoleculerError(
					"Missing access token!",
					401,
					"NO_ACCESS_TOKEN"
				);
			}
		},
	},
};
