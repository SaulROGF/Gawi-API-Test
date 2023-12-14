
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Device } from './device.entity';

@Table({
  tableName: 'apns',
})
export class Apn extends Model<Apn> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idApn: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  companyName: string;
  
  @Column({
    type: DataType.STRING(32),
    allowNull: false,
  })
  apn: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue : '',
  })
  user: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue : '',
  })
  password: string;

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

  // @UpdatedAt
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
  /**
   * join declarations
   */
  @HasMany(() => Device, 'idApn')
  devices: Device[];
}

export const apnProviders = [
    {
      provide: 'ApnRepository',
      useValue: Apn,
    },
  ];
  