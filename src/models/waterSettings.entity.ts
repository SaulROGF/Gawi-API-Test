import { Device } from './device.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';


@Table({
  tableName: 'waterSettings',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class WaterSettings extends Model<WaterSettings> {
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
  idWaterSettings: number;

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
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: '1.0.0',
    comment : '',
  })
  firmwareVersion: string;

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment : 'Si todos los campos de status son 1 (16383 o aplicados) el valor es true',
  })
  wereApplied: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,//16383 = todos estan aplicados (2 a la 14)
    comment : 'Bandera de binarios en numero entero con val max 16383 que representa cuando se debe aplicar una configuración',
  })
  status: number;

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
    type: DataType.STRING(5),
    allowNull: false,
    comment : 'Valores permitidos LPS, M3H y GPM',
  })
  flowUnits: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 60,
    comment : 'Valores de 0 a 60 (unidad en minutos) 60 = cada hora',
  })
  storageFrequency: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: "00:00",
    comment : 'Formato de horas y minutos 00:00',
  })
  storageTime: string;

  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 1,
    comment : '0 o 1 = desactivada/activada',
  })
  dailyTransmission: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: '',
    comment : 'Formato de horas y minutos 00:00',
  })
  dailyTime: string;

  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 0,
    comment : '0 o 1  = 12 am(media noche)/12 pm(medio dia)',
  })
  customDailyTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment : 'Cada cuantos minutos transmite periódicamente ( 0 a 1440 ) donde 1440 es = 1 dia',
  })
  periodicFrequency: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: '',
    comment : 'Formato de horas y minutos 00:00',
  })
  periodicTime: string;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment : 'Opciones: 0 = continua y 1 = mensual',
  })
  consumptionAlertType: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment : '1 a ???, la unidad seria igual a 1 litro/min',
  })
  consumptionSetpoint: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 30,
    comment : 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
  })
  dripSetpoint: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 30,
    comment : 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
  })
  burstSetpoint: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 30,
    comment : 'De 0 a 1440 medida en minutos donde 1440 = 1 dia',
  })
  flowSetpoint: number;

  /**
   * Configuraciones de las alertas
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para activar las notificaciones en la app para goteo',
  })
  dripFlag: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para activar las notificaciones en la app para notificaciones de manipulacion',
  })
  manipulationFlag: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    comment : 'Variable para activar las notificaciones de flujo inverso en la app',
  })
  reversedFlowFlag: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para activar las notificaciones de fuga inverso en la app',
  })
  burstFlag: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para activar las notificaciones de burbujas inverso en la app',
  })
  bubbleFlag: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
    comment : 'Variable para activar las notificaciones de tuberia vacia inverso en la app',
  })
  emptyFlag: boolean;

  
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

  // Crea un nuevo numero de status apartir del actual segun la alarma que se quiere actualizar
  //16383 max
  calculateNewStatus( noSetting: number, isForApply: boolean ) {
    let stringStatus: string = this.status.toString(2);

    while (stringStatus.length < 14) {
      stringStatus = "0" + stringStatus;
    }

    let newStatus = [];

    for (let index = 0; index < stringStatus.length; index++) {
      const element = parseInt(stringStatus[index]);
      newStatus.push(element);
    }

    if (noSetting < 14) {
      newStatus[13 - noSetting] = isForApply ? 0 : 1
    }

    let newStringStatus = "";

    for (let index = 0; index < newStatus.length; index++) {
      const element = newStatus[index];
      newStringStatus = newStringStatus + element.toString();
    }

    return parseInt(newStringStatus, 2);//16383 max
  }
}
