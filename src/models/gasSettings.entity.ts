import * as bcrypt from 'bcrypt';
import { Device } from './device.entity';
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
} from 'sequelize-typescript';

@Table({
  tableName: 'gasSettings',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class GasSettings extends Model<GasSettings> {
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
  idGasSettings: number;

  @ForeignKey(() => Device)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idDevice: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  destUrl: string;

  @Column({
    type: DataType.STRING(5),
    allowNull: false,
  })
  closingHour: string;

  @Column({
    type: DataType.STRING(4),
    allowNull: false,
  })
  consumptionUnits: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  consumptionPeriod: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minFillingPercentage: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  interval: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minsBetweenMeasurements: number;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  travelMode: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: '0',
  })
  firmwareVersion: string;


  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  offset: number;
  
  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: '00:01',
  })
  offsetTime: string;


  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  wereApplied: boolean;

  // @CreatedAt
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
  
  // @UpdatedAt
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

  @BelongsTo(() => Device, 'idDevice')
  device: Device;
}
