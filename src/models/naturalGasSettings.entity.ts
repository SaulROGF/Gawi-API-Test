import { Device } from './device.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';


@Table({
  tableName: 'naturalGasSettings',
  /* timestamps: true,
  updatedAt: true,
  createdAt: true, */
})
export class NaturalGasSettings extends Model<NaturalGasSettings> {
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
  idNaturalGasSettings: number;

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
   * Configuraciones requeridas
   */

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment : 'Fecha de corte con default primer dia de cada mes',
  })
  serviceOutageDay: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0.0,
    comment : 'Limite para mandar la alerta de consumo exedido',
  })
  monthMaxConsumption: number;

  /**
   * Configuraciones generales
   */
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    comment : 'Url a la cual el dispositivo esta transmitiendo continuamente',
  })
  apiUrl: string;

  @Column({
    type: DataType.STRING(5),
    allowNull: false,
    comment : 'valores permitidos M3 , L y G',
  })
  consumptionUnits: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment : 'del 0 al 2 donde 0 = ipv4, 1 = ipv6 y 2 = ipv6v4',
  })
  ipProtocol: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment : 'del 0 al 3 donde 0 = none, 1 = PAP, 2 = CHAP, 3 = PAP/CHAP',
  })
  auth: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: "",
    comment : 'Comentario o pequeña descripción para identificar el dispositivo',
  })
  label: string;
  
  /**
   *
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para apagar o prender el medidor de agua',
  })
  isOn: boolean;


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
    comment : '',
  })
  updatedAt: Date;

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
    comment : '',
  })
  createdAt: Date;

  /**
   * Relaciones
   */
  @BelongsTo(() => Device, 'idDevice')
  device: Device;
}
