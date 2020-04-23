"use strict";

//const DbMixin = require("../mixins/db.mixin");
const MailServerMixin = require("moleculer-mail");
const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * The entity's validator schema
 */
const entitySchema = {
	recipient: "string|email",
	subject: "string",
	sent: "date|convert:true",
};

module.exports = {
	/**
	 * Service name
	 */
	name: "mails",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("mails"), MailServerMixin],

	/**
	 * Settings
	 */
	settings: {
		/**
		 * DB mixin configuration
		 */
		entityName: "mail",
		fields: ["_id", "resipient", "subject", "sent"],

		/**
		 * Validator configuration
		 */
		entityValidator: entitySchema,

		/**
		 * Mail server configuration
		 */
		from: "admin@orgware-connect",
		transport: {
			host: "localhost",
			port: 2500,
			secure: false,
		},
	},

	/**
	 * Action Hooks
	 */
	hooks: {},

	/**
	 * Actions
	 */
	actions: {
		sendTemporaryPassword: {
			params: {
				email: "email",
			},
			async handler(ctx) {
				let { email } = ctx.params;
				let subject = "Orgware Connect: Elfelejtett jelszó!";
				this.actions.create;
				await this.actions.send({
					to: email,
					subject: subject,
					text: "Elfelejtett jelszó emlékeztető",
				});
				return {
					status: "EMAIL_SENT",
				};
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {},
	async started() {},
};
