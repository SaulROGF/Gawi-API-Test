import { Card } from './card.entity';
import * as bcrypt from 'bcrypt';
import { Town } from './town.entity';
import { Role } from './role.entity';
import { Device } from './device.entity';
import { Organization } from './organization.entity';
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
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { BillingInformation } from './billingInformation.entity';
import { HistoryPayment } from './historyPayments.entity';
import { Notifications } from './notifications.entity';

@Table({
  tableName: 'users', 
  timestamps: true,
  createdAt: false,
  updatedAt: false,
})
export class User extends Model<User> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idUser: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
    comment:
      ' 1 = Root admin' +
      '2 = Organization Admin' +
      '3 = Warehouse user ' +
      '4 = Conta' +
      '5 = Driver' +
      '6 = Technician' +
      '7 = Final User,',
  })
  idRole: number;

  @ForeignKey(() => Town)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idTown: number;

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
    type: DataType.STRING(150),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    defaultValue: '',
  })
  firstName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    defaultValue: '',
  })
  lastName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    defaultValue: '',
  })
  mothersLastName: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: '',
  })
  phone: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  passwordAlexa: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  passwordGoogle: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  passwordFacebook: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: '',
  })
  idConektaAccount: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue:  () => {
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
  lastLoginDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  deleted: boolean;

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

  @BelongsTo(() => Town, 'idTown')
  town: Town;

  @BelongsTo(() => Role, 'idRole')
  role: Role;

  @BelongsTo(() => Organization, 'idOrganization')
  organization: Organization;

  @HasMany(() => Device, 'idUser')
  devices: Device[];

  @HasMany(() => Notifications, 'idUser')
  notifications: Notifications[];

  @HasMany(() => HistoryPayment, 'idUser')
  historyPayments: HistoryPayment[];

  @HasMany(() => Card, 'idUser')
  cards: Card[];

  @HasOne(() => BillingInformation, 'idUser')
  billingInformation: BillingInformation;

  /**
   * implemented methods
   */
  @BeforeCreate
  public static async hashPassword(user: User) {
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
  }

  public validPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  public async validAlexaPassword(password: string) {
    if( this.passwordAlexa.length == 0 ){
      this.passwordAlexa =  await bcrypt.hash(password, bcrypt.genSaltSync(10));
      return {
        checkPass : true,
        isNew : true
      };
    }else{
      return {
        checkPass : bcrypt.compare(password, this.passwordAlexa),
        isNew : false
      };
      
    }
  }

  public async hashNewPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
  }
}
