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
  tableName: 'cards',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class Card extends Model<Card> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idCard: number;

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
    type: DataType.STRING(100),
    allowNull: false,
  })
  conektaCardToken: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  printedName: string;

  @Column({
    type: DataType.INTEGER({ length: 4 }),
    allowNull: false,
  })
  last4Digits: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  activePaymentMethod: boolean;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  brand: string;

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
