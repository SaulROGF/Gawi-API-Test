import * as bcrypt from 'bcrypt';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Device } from './device.entity';
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
} from 'sequelize-typescript';

@Table({
  tableName: 'historyPayments',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
})
export class HistoryPayment extends Model<HistoryPayment> {
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
  idHistoryPayments: number;

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
    type: DataType.INTEGER,
    allowNull: false,
    comment: '0 - suscripción un año pago con tarjeta, 1 - Transferencia electrónica de fondos'
  })
  type: number;

  @Column({
    type: DataType.STRING(1255),
    allowNull: false,
  })
  paymentToken: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  product: string;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    comment: '0 - la suscripcion no se renueva automaticamente'
  })
  currency: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
    comment: 'waiting-pay, waiting-approval, successful-payment, payment-error, '
  })
  status: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
    defaultValue: '',
  })
  commentForUser: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  facturapiInvoiceId: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue: '',
  })
  verificationUrl: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  conektaOrderId: string;

  @Column({
    type: DataType.STRING(5000),
    allowNull: false,
  })
  object: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  invoiced: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  needInvoice: boolean;

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
  @BelongsTo(() => User, 'idUser')
  user: User;

  @BelongsTo(() => Organization, 'idOrganization')
  organization: Organization;
  
  @BelongsTo(() => Device, 'idDevice')
  device: Device;
}