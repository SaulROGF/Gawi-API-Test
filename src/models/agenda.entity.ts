import * as bcrypt from 'bcrypt';
import { Organization } from './organization.entity';
import { Device } from './device.entity';
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
  tableName: 'agendas',
  timestamps: true,
  updatedAt: false,
  createdAt: false,
})
export class Agenda extends Model<Agenda> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idAgenda: number;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idOrganization: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idUser: number;

  @ForeignKey(() => Device)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idDevice: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  comment: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
  })
  viewDate: Date;

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
