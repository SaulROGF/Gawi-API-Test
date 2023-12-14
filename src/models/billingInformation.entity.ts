import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'billingInformation',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class BillingInformation extends Model<BillingInformation> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idBillingInformation: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idUser: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  businessName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  rfc: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
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
  facturapiClientToken: string;

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
}
