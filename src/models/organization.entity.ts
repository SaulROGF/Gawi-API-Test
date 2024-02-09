import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Device } from './device.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Regions } from './regions.entity';
import { Stations } from './stations.entity';

@Table({
  tableName: 'organizations',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
})
export class Organization extends Model<Organization> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idOrganization: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  comercialName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  fiscalName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  rfc: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: '',
  })
  phone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  zipCode: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  suburb: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  addressNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  facturapiToken: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  fiscalAddress: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  contactPhone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  contactEmail: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  logoUrl: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  primaryColor: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  secondaryColor: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validUntil: Date;

  @Column({
    type:  DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  type : number;//0 = Root , 1 - Gas , 2 Agua (venta) , 3 Agua (distribuidor)

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  deleted: boolean;

  /**
   * join declarations
   */
  @HasMany(() => Device, 'idOrganization')
  devices: Device[];

  @HasMany(() => User, 'idOrganization')
  users: User[];

  @HasMany(() => Regions, 'idOrganization')
  regions: Regions[];

  @HasMany(() => Stations)
  stations: Stations[];
}