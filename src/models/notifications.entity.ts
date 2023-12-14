import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    ForeignKey,
    HasOne,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
    tableName: 'notifications',
})
export class Notifications extends Model<Notifications> {

    /**
     * Primary and foreign keys
     */
    @Column({
        type: DataType.INTEGER({ length: 11 }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    })
    idNotification: number;


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
        type: DataType.STRING(52),
        allowNull: false,
        unique : true,
    })
    uuid: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    token: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    isLogged: boolean;


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
    lastLogin: Date;

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
    users: User;
}

export const notificationProviders = [
    {
        provide: 'NotificationsRepository',
        useValue: Notifications,
    },
];
