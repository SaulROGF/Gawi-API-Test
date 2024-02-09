import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.entity';
import { Device } from '../models/device.entity';
import { Role } from '../models/role.entity';
import { Town } from '../models/town.entity';
import { State } from '../models/state.entity';
import { Organization } from '../models/organization.entity';
import { Card } from '../models/card.entity';
import { BillingInformation } from '../models/billingInformation.entity';
import { GasHistory } from '../models/gasHistory.entity';
import { WaterHistory } from '../models/waterHistory.entity';
import { GasSettings } from '../models/gasSettings.entity';
import { WaterSettings } from '../models/waterSettings.entity';
import { HistoryPayment } from '../models/historyPayments.entity';
import { Agenda } from '../models/agenda.entity';
import { Apn } from '../models/apn.entity';
import { DepartureOrder } from '../models/departureOrders.entity';
import { Notifications } from '../models/notifications.entity';
import { DataloggerSettings } from '../models/dataloggerSettings.entity';
import { DataloggerHistory } from '../models/dataloggerHistory.entity';
import { NaturalGasHistory } from '../models/naturalGasHistory.entity';
import { NaturalGasSettings } from '../models/naturalGasSettings.entity';

import { Regions } from 'src/models/regions.entity';
import { Zones } from 'src/models/zones.entity';
import { Stations } from 'src/models/stations.entity';
import { DeviceStation } from 'src/models/deviceStation.entity';

export const databaseProviders = [
  {
    provide: 'SequelizeInstance',
    useFactory: async () => {
      const sequelize = new Sequelize({
        define: {
          timestamps: false,
        },
        dialect: 'mysql',
       // host: '198.12.216.200',
        host: process.env.DB_HOST,
        port: 3306,
        logging: false,
        username: process.env.DB_USR,
        password: process.env.DB_PSW,
        database: process.env.DB_NAME,
      });

      sequelize.addModels([
        User,
        Device,
        Role,
        Town,
        State,
        Organization,
        Card,
        BillingInformation,
        GasHistory,
        WaterHistory,
        GasSettings,
        WaterSettings,
        HistoryPayment,
        Agenda,
        Apn,
        DepartureOrder,
        Notifications,
        DataloggerHistory,
        DataloggerSettings,
        NaturalGasSettings,
        NaturalGasHistory,
        Regions, 
        Zones, 
        Stations,
        DeviceStation
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];