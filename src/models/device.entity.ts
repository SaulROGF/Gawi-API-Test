import { Apn } from './apn.entity';
import { GasSettings } from './gasSettings.entity';
import { WaterSettings } from './waterSettings.entity';
import * as bcrypt from 'bcrypt';
import { Town } from './town.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { GasHistory } from './gasHistory.entity';
import { WaterHistory } from './waterHistory.entity';
import { DataloggerSettings } from './dataloggerSettings.entity';
import { DataloggerHistory } from './dataloggerHistory.entity';
import { NaturalGasHistory } from './naturalGasHistory.entity';
import { NaturalGasSettings } from './naturalGasSettings.entity';

@Table({
  tableName: 'devices',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
  /**
  defaultScope: {
    attributes: { exclude: ['imei'] },
  },
  */
})
export class Device extends Model<Device> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  idDevice: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idUser: number;

  @ForeignKey(() => Town)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idTown: number;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idOrganization: number;

  @ForeignKey(() => Apn)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idApn: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  imei: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    defaultValue: '',
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  serialNumber: string;

  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: false,
    comment: '0 - gas, 1 - agua, 2 - datalogger',
  })
  type: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: '',
  })
  boardVersion: string;

  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 0,
  })
  version: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: false,
  })
  tankCapacity: number;

  @Column({
    type: DataType.DOUBLE({ length: 15, decimals: 8 }),
    allowNull: false,
  })
  latitude: number;

  @Column({
    type: DataType.DOUBLE({ length: 15, decimals: 8 }),
    allowNull: false,
  })
  longitude: number;

  @Column({
    type: DataType.STRING(300),
    allowNull: true,
    defaultValue: '',
  })
  address: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: '',
  })
  extNumber: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: '',
  })
  intNumber: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    defaultValue: '',
  })
  suburb: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    defaultValue: '',
  })
  zipCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: '',
  })
  firmwareVersion: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      let date = new Date();
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ),
      );
    },
  })
  batteryDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue : false
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      let date = new Date();
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ),
      );
    },
  })
  validUntil: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      let date = new Date();
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ),
      );
    },
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      let date = new Date();
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ),
      );
    },
  })
  updatedAt: Date;

  /**
   * join declarations
   */
  @BelongsTo(() => User, 'idUser')
  user: User;

  @BelongsTo(() => Apn, 'idApn')
  apn: Apn;

  @BelongsTo(() => Organization, 'idOrganization')
  organization: Organization;

  @HasMany(() => GasHistory, 'idDevice')
  gasHistory: GasHistory[];

  @HasMany(() => WaterHistory, 'idDevice')
  waterHistory: WaterHistory[];

  @HasMany(() => DataloggerHistory, 'idDevice')
  dataloggerHistory: DataloggerHistory[];

  @HasMany(() => NaturalGasHistory, 'idDevice')
  naturalGasHistory: NaturalGasHistory[];

  @HasOne(() => WaterSettings, 'idDevice')
  waterSettings: WaterSettings;

  @HasOne(() => GasSettings, 'idDevice')
  gasSettings: GasSettings;

  @HasOne(() => NaturalGasSettings, 'idDevice')
  naturalGasSettings: NaturalGasSettings;

  @HasOne(() => DataloggerSettings, 'idDevice')
  dataloggerSettings: DataloggerSettings;

  @BelongsTo(() => Town, 'idTown')
  town: Town;
  
  /**
   * implemented methods
   */
  @BeforeCreate
  public static async hashImei(device: Device) {
    device.imei = await bcrypt.hash(device.imei, bcrypt.genSaltSync(10));
  }

  public validateImei(imei: string) {
    return bcrypt.compare(imei, this.imei);
  }

  public async hashNewImei(imei: string) {
    return await bcrypt.hash(imei, bcrypt.genSaltSync(10));
  }
}
