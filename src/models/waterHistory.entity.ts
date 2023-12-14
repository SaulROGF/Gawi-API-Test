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
  tableName: 'waterHistory',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class WaterHistory extends Model<WaterHistory> {
  /**
   * Llave primaria
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  idWaterHistory: number;

  /**
   * Llaves foraneas
   */
  @ForeignKey(() => Device)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idDevice: number;

  /**
   * Configuraciones generales
   */
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flow: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  consumption: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  reversedConsumption: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  temperature: number;

  /**
   * Alertas
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  dripAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  manipulationAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  emptyAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  burstAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  bubbleAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  reversedFlowAlert: boolean;

  /**
   * Status
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  bateryLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalQuality: number;

  @ForeignKey(() => Device)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  reason: number;

  /**
   * Fechas de creacion y actualizacion
   */
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
  dateTime: Date;

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
   * Relaciones
   */
  @BelongsTo(() => Device, 'idDevice')
  devices: Device;
}
