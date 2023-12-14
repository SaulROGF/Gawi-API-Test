import * as bcrypt from 'bcrypt';
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
import { Organization } from './organization.entity';
import { User } from './user.entity';


@Table({
  tableName: 'departureOrders',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class DepartureOrder extends Model<DepartureOrder> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  idDepartureOrder: number;


  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idUser: number;

  
  @ForeignKey(() => Organization)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idOrganization: number;


  /**
   * column declarations
   */
  @Column({
    type: DataType.INTEGER({ length: 2 }),
    allowNull: false,
    defaultValue: 1,
    comment: '0 - cancelada, 1 - sin iniciar, 2 - en proceso, 3 - completada, 4 - cerrada',
  })
  status: number;


  @Column({
    type: DataType.INTEGER({ length: 2 }),
    allowNull: false,
    defaultValue: 1,
    comment: '0 - dispositivo de gas, 1 - dispositivo de agua',
  })
  deviceType: number;


  @Column({
    type: DataType.INTEGER({ length: 1 }),
    allowNull: true,
    defaultValue: 0,
  })
  deviceQuantity: number;


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


  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deliveredAt: Date;


  /**
   * relationships
   */
  @BelongsTo(() => User, 'idUser')
  user: User;

  @BelongsTo(() => Organization, 'idOrganization')
  organization: Organization;
}
