import { Device } from './device.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';


@Table({
  tableName: 'dataloggerSettings',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class DataloggerSettings extends Model<DataloggerSettings> {
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
  idSettings: number;

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
  })
  createdAt: Date;

  /**
   * Configuraciones generales
   */
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
    comment: 'del 0 al 3 donde 0 = none, 1 = PAP, 2 = CHAP, 3 = PAP/CHAP',
  })
  auth: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    defaultValue: 'http://api-test.gawi.mx/',
  })
  apiUrl: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  analogMode1: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  analogMode2: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  analogMode3: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  analogMode4: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogBoundary1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogBoundary2: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogBoundary3: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogBoundary4: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  flowUnits1: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  flowUnits2: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  consumptionUnits1: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  consumptionUnits2: number;

  /**
   * Setpoints
   */
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowSetpointLow1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowSetpointLow2: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowSetpointHigh1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowSetpointHigh2: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointLow1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointLow2: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointLow3: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointLow4: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointHigh1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointHigh2: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointHigh3: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  analogSetpointHigh4: number;

  /**
   * Constantes proporcionales
   */
  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowConstant1: number;

  @Column({
    type: DataType.DOUBLE({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  flowConstant2: number;

  /**
   * Transmisiones
   */
  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 1,
    comment: '0 o 1 = desactivada/activada',
  })
  dailyTransmission: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: '00:00',
    comment: 'Formato de horas y minutos 00:00',
  })
  dailyTime: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 60,
    comment: 'Valores de 0 a 60 (unidad en minutos) 60 = cada hora',
  })
  storageFrequency: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: "00:00",
    comment: 'Formato de horas y minutos 00:00',
  })
  storageTime: string;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: "00:00",
    comment: 'Formato de horas y minutos 00:00',
  })
  repeatNotificationTime: string;

  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 0,
    comment: '0 o 1 = 12 am(media noche)/12 pm(medio dia)',
  })
  customDailyTime: number;

  @Column({
    type: DataType.STRING(5),
    allowNull: true,
    defaultValue: '00:00',
    comment: 'Formato de horas y minutos 00:00',
  })
  periodicTime: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Cada cuantos minutos transmite periódicamente ( 0 a 1440 ) donde 1440 es = 1 dia',
  })
  periodicFrequency: number;

  /**
   * Otros
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 1,
  })
  isPoweredByBattery: boolean;
  
  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 1,
    comment: '0 o 1 = desactivada/activada',
  })
  measurePowerSupply: number;
 
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: "",
    comment: 'Comentario o pequeña descripción para identificar el dispositivo',
  })
  label: string;
  
  /**
   * Configuraciones de entradas digitales
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  digitalMonitoring: number;

  /**
   * etiquetas para las entradas analógicas
   */
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'AN-1',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  analogLabel1: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'AN-2',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  analogLabel2: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'AN-3',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  analogLabel3: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'AN-4',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  analogLabel4: string;
  
  /**
   * etiquetas para las entradas digitales
   */
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'DG-1',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  digitalLabel1: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'DG-2',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  digitalLabel2: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'DG-3',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  digitalLabel3: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: 'DG-4',
    comment: 'Comentario o pequeña descripción para identificar la entrada',
  })
  digitalLabel4: string;
  
  /**
   * tipos de sensor conectados a la entrada analógica
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalType1: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalType2: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalType3: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  signalType4: number;
  
  /**
   * Relaciones
   */
  @BelongsTo(() => Device, 'idDevice')
  device: Device;
}
