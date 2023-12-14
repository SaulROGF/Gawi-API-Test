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
    HasOne,
    HasMany,
  } from 'sequelize-typescript';
import { Device } from './device.entity';
import { Stations } from './stations.entity';
@Table({
    tableName: 'deviceStation',
    timestamps: true,
    updatedAt: false,
    createdAt: false,
    /**
    defaultScope: {
      attributes: { exclude: ['imei'] },
    },
    */
  })
  export class DeviceStation extends Model<DeviceStation> {
    
    @Column({
        type: DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      })
      idDeviceStation: number;

    @ForeignKey(() => Device)
    @Column({
        type: DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
        unique: true,
      })
      idDevice: number;

      @ForeignKey(() => Stations)
      @Column({
          type: DataType.INTEGER, 
          allowNull: false, 
          field: 'idStation'
      })
      idStation: number;
      
      /*
      @HasMany(() => Stations)
      stations: Stations[];
      
       @HasOne(() => Device)
       Device: Device[];
       */
       @BelongsTo(() => Device, 'idDevice')
       device: Device;
       @BelongsTo(() => Stations, 'idStation')
       stations: Stations;
  
  }
