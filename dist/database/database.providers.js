"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../models/user.entity");
const device_entity_1 = require("../models/device.entity");
const role_entity_1 = require("../models/role.entity");
const town_entity_1 = require("../models/town.entity");
const state_entity_1 = require("../models/state.entity");
const organization_entity_1 = require("../models/organization.entity");
const card_entity_1 = require("../models/card.entity");
const billingInformation_entity_1 = require("../models/billingInformation.entity");
const gasHistory_entity_1 = require("../models/gasHistory.entity");
const waterHistory_entity_1 = require("../models/waterHistory.entity");
const gasSettings_entity_1 = require("../models/gasSettings.entity");
const waterSettings_entity_1 = require("../models/waterSettings.entity");
const historyPayments_entity_1 = require("../models/historyPayments.entity");
const agenda_entity_1 = require("../models/agenda.entity");
const apn_entity_1 = require("../models/apn.entity");
const departureOrders_entity_1 = require("../models/departureOrders.entity");
const notifications_entity_1 = require("../models/notifications.entity");
const dataloggerSettings_entity_1 = require("../models/dataloggerSettings.entity");
const dataloggerHistory_entity_1 = require("../models/dataloggerHistory.entity");
const naturalGasHistory_entity_1 = require("../models/naturalGasHistory.entity");
const naturalGasSettings_entity_1 = require("../models/naturalGasSettings.entity");
const regions_entity_1 = require("../models/regions.entity");
const zones_entity_1 = require("../models/zones.entity");
const stations_entity_1 = require("../models/stations.entity");
const deviceStation_entity_1 = require("../models/deviceStation.entity");
exports.databaseProviders = [
    {
        provide: 'SequelizeInstance',
        useFactory: async () => {
            const sequelize = new sequelize_typescript_1.Sequelize({
                define: {
                    timestamps: false,
                },
                dialect: 'mysql',
                host: process.env.DB_HOST,
                port: 3306,
                logging: false,
                username: process.env.DB_USR,
                password: process.env.DB_PSW,
                database: process.env.DB_NAME,
            });
            sequelize.addModels([
                user_entity_1.User,
                device_entity_1.Device,
                role_entity_1.Role,
                town_entity_1.Town,
                state_entity_1.State,
                organization_entity_1.Organization,
                card_entity_1.Card,
                billingInformation_entity_1.BillingInformation,
                gasHistory_entity_1.GasHistory,
                waterHistory_entity_1.WaterHistory,
                gasSettings_entity_1.GasSettings,
                waterSettings_entity_1.WaterSettings,
                historyPayments_entity_1.HistoryPayment,
                agenda_entity_1.Agenda,
                apn_entity_1.Apn,
                departureOrders_entity_1.DepartureOrder,
                notifications_entity_1.Notifications,
                dataloggerHistory_entity_1.DataloggerHistory,
                dataloggerSettings_entity_1.DataloggerSettings,
                naturalGasSettings_entity_1.NaturalGasSettings,
                naturalGasHistory_entity_1.NaturalGasHistory,
                regions_entity_1.Regions,
                zones_entity_1.Zones,
                stations_entity_1.Stations,
                deviceStation_entity_1.DeviceStation
            ]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
//# sourceMappingURL=database.providers.js.map