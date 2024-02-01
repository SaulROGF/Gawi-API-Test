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
  tableName: 'naturalGasHistory',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class NaturalGasHistory extends Model<NaturalGasHistory> {

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
  idNaturalGasHistory: number;

  /**
   * Llave foranea
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
  consumption: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  temperature: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  signalQuality: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  bateryLevel: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  reason: number;

  @Column({
    type: DataType.TIME,
    allowNull: true,
    defaultValue: null,
  })
  hour: string;

  /**
   * Alertas
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  consumptionAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  consumptionExcessAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  lowBatteryAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  sensorAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  darkAlert: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  lightAlert: boolean;

   /**
   * Fechas de creacion y actualizacion
   */
   @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      const date = new Date();
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
      const date = new Date();
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
    comment : '',
  })
  updatedAt: Date;
  
  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: () => {
      const date = new Date();
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
  device: Device;
}