import { Device } from './device.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'gasHistory',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class GasHistory extends Model<GasHistory> {
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
  idGasHistory: number;

  @ForeignKey(() => Device)
  @Column({ type: DataType.INTEGER({ length: 11 }), allowNull: false })
  idDevice: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: false,
  })
  measure: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: false,
  })
  meanConsumption: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  bateryLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  accumulatedConsumption: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  signalQuality: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  resetAlert: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  intervalAlert: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  fillingAlert: boolean;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: false,
  })
  temperature: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
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
  dateTime: Date;

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

  /**
   * join declarations
   */
  @BelongsTo(() => Device, 'idDevice')
  devices: Device;
}
