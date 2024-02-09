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
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  wereApplied: boolean;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  status: number;

  @Column({
    type: DataType.STRING({ length: 100 }),
    allowNull: true,
    defaultValue: '0.0',
  })
  firmwareVersion: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  serviceOutageDay: number;

  @Column({
    type: DataType.FLOAT({ length: 10, decimals: 2 }),
    allowNull: true,
    defaultValue: 0.0,
  })
  monthMaxConsumption: number;

  @Column({
    type: DataType.STRING({ length: 150 }),
    allowNull: true,
    defaultValue: '',
  })
  apiUrl: string;

  @Column({
    type: DataType.STRING({ length: 10 }),
    allowNull: true,
    defaultValue: '',
  })
  consumptionUnits: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  storageFrequency: number;

  @Column({
    type: DataType.TIME,
    allowNull: true,
    defaultValue: '00:00',
  })
  storageTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
    defaultValue: '00:00',
  })
  dailyTime: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  customDailyTime: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  dailyTransmission: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  periodicFrequency: number;

  @Column({
    type: DataType.TIME,
    allowNull: true,
    defaultValue: '00:00',
  })
  periodicTime: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  ipProtocol: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  auth: number;

  @Column({
    type: DataType.STRING({ length: 50 }),
    allowNull: true,
    defaultValue: '',
  })
  label: string;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  consumptionAlertType: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  consumptionAlertSetPoint: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  consumptionExcessFlag: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  lowBatteryFlag: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  sensorFlag: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  darkSetPoint: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  darkFlag: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  lightSetPoint: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 1,
  })
  lightFlag: number;

  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: 0,
  })
  isOn: number;

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

    const newStatus = [];

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


      // Crea un nuevo numero de status apartir del actual segun la alarma que se quiere actualizar
  //16383 max
  calculateNewMultiStatus(status: number, noSetting: number, isForApply: boolean ) {
    let stringStatus: string = status.toString(2);

    while (stringStatus.length < 14) {
      stringStatus = "0" + stringStatus;
    }

    const newStatus = [];

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

  calcularBit(setting: string){
    let bit = 0;
    switch (setting) {
      case 'customDailyTime':
        bit = 0;
        break;
      case 'consumptionUnits':
        bit = 1;
        break;
      case 'storageFrequency':
        bit = 2;
        break;
      case 'dailyTime':
        bit = 3;
        break;
      case 'periodicFrequency':
        bit = 4;
        break;
      case 'apiUrl':
        bit = 5;
        break;
      case 'apn':
        bit = 6;
        break;
      case 'label':
        bit = 7;
        break;
      case 'consumptionAlertSetpoint':
        bit = 8;
        break;
      case 'consumptionAlertType':
        bit = 9;
        break;
      case 'lowBatteryFlag':
        bit = 10;
        break;
      case 'sensorFlag':
        bit = 11;
        break;
      case 'darkFlag':
        bit = 12;
        break;
      case 'lightFlag':
        bit = 13;
        break;
      default:
        bit = 16383;
        break;
    }
    return bit;
        
  }
}
