"use strict";

const fs = require("fs");
const mkdir = require("mkdirp").sync;
const { MoleculerError } = require("moleculer").Errors;

const DbService = require("moleculer-db");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function(collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema = {
		mixins: [DbService],

		settings: {
			systemAccountCode: "0000000000"
		},

		actions: {
			list: {
				rest: null
			},
			create: {
				rest: null
			},
			get: {
				rest: null
			},
			update: {
				rest: null,
				async handler(ctx) {
					let params = ctx.params;
					let employeeId =
						ctx.meta.user && ctx.meta.user.employee
							? ctx.meta.user.employee
							: this.settings.systemAccountCode;
					if (!this.settings.entityRevisions) {
						params.modifiedAt = new Date();
						params.modifiedBy = employeeId;
						return this._update(ctx, params);
					}

					let entity = await this.adapter.findOne({
						_id: this.adapter.stringToObjectID(params._id)
					});

					if (entity) {
						entity.modifiedAt = new Date();
						entity.modifiedBy = employeeId;
						delete entity._id;
						await this.adapter.collectionRevisions.insert(entity);
					}
					params.revision = entity.revision + 1;
					params.createdAt = new Date();
					params.createdBy = employeeId;
					params.modifiedAt = "";
					params.modifiedBy = "";
					return this._update(ctx, params);
				}
			},
			updateWithoutRevision: {
				handler(ctx) {
					let params = ctx.params;
					return this._update(ctx, params);
				}
			},
			delete: {
				async handler(ctx) {
					let params = ctx.params;
					params.isDeleted = true;
					if (!this.settings.entityRevisions) {
						params.modifiedAt = new Date();
						params.modifiedBy = ctx.meta.user.employee;
						return this._update(ctx, params);
					}

					let entity = await this.adapter.findOne({
						_id: this.adapter.stringToObjectID(params._id)
					});

					if (entity) {
						entity.modifiedAt = new Date();
						entity.modifiedBy = ctx.meta.user.employee;
						delete entity._id;
						await this.adapter.collectionRevisions.insert(entity);
					}

					params.revision = entity.revision + 1;
					params.createdAt = new Date();
					params.createdBy = ctx.meta.user.employee;
					params.modifiedAt = "";
					params.modifiedBy = "";
					return this._update(ctx, params);
				}
			},
			remove: {
				rest: null
			}
		},
		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			}
		},

		hooks: {},
		methods: {
			async findOneByCode(query) {
				query.isDeleted = false;

				let result = await this.adapter.findOne(query);

				if (result) {
					return result;
				}
				throw new MoleculerError(
					"Entity not found!",
					404,
					"ENTITY_NOT_FOUND"
				);
			},
			async findOne(query) {
				query.isDeleted = false;

				let result = await this.adapter.findOne(query);

				if (result) {
					return result;
				}
				throw new MoleculerError(
					// eslint-disable-next-line
					`Entity not found!`,
					404,
					"ENTITY_NOT_FOUND"
				);
			},

			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {any} json
			 * @param {Context} ctx
			 */
			async entityChanged(type, json, ctx) {
				ctx.broadcast(cacheCleanEventName);
			},
			async getNextFreeCode(codeLength) {
				let recordWithLastCode = await this.actions.find({
					query: {},
					limit: 1,
					sort: "-code"
				});
				if (recordWithLastCode.length > 0) {
					let latestCodeString = recordWithLastCode[0].code;
					let codeAsInteger = parseInt(latestCodeString) + 1;
					return this.padWithZero(codeAsInteger, codeLength);
				} else {
					return "0001";
				}
			},
			padWithZero(number, length) {
				let zero = "0";
				number = number + "";
				return number.length >= length
					? number
					: new Array(length - number.length + 1).join(zero) + number;
			},
			addCreateParams(ctx) {
				ctx.params.revision = 1;
				ctx.params.createdAt = new Date();
				let employeeId =
					ctx.meta.user && ctx.meta.user.employee
						? ctx.meta.user.employee
						: this.settings.systemAccountCode;
				ctx.params.createdBy = employeeId;
				ctx.params.isDeleted = false;
			}
		},

		async started() {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const count = await this.adapter.count();
				if (count == 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info(
						"Seeding is done. Number of records:",
						await this.adapter.count()
					);
				}
			}
		}
	};

	const url = process.env.MONGO_URI || "mongodb://localhost:27017/owconnect";
	//let url = undefined;

	if (url) {
		// Mongo adapter
		const MongoAdapter = require("./mongo.adapter");

		schema.adapter = new MongoAdapter(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		schema.collection = collection;
	} else if (process.env.TEST) {
		// NeDB memory adapter for testing
		schema.adapter = new DbService.MemoryAdapter();
	} else {
		// NeDB file DB adapter

		// Create data folder
		if (!fs.existsSync("./data")) {
			mkdir("./data");
		}

		schema.adapter = new DbService.MemoryAdapter({
			filename: `./data/${collection}.db`
		});
	}

	return schema;
};
