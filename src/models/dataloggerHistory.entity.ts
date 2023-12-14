import { Device } from './device.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

const IN_1_GAIN = 1; // 0.0703

@Table({
  tableName: 'dataloggerHistory',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class DataloggerHistory extends Model<DataloggerHistory> {
  /**
   * Llave primaria
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  idHistory: number;

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
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  batteryLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalQuality: number;

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
   * Mediciones
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  digitalInputs: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  digitalOutputs: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
    get(): number {
      return IN_1_GAIN * this.getDataValue('analogInput1');
    }
  })
  analogInput1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogInput2: number;
  
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogInput3: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogInput4: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flow1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flow2: number;
  
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  consumption1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  consumption2: number;

  /**
   * Alertas
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  alerts: number;

  /**
   * Relaciones
   */
  @BelongsTo(() => Device, 'idDevice')
  device: Device;
}
