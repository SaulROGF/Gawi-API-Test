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
   * Consumo
   */
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: false,
  })
  consumption: number;

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
  device: Device;
}
