import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table, Model, HasMany } from "sequelize-typescript";
import { Organization } from "./organization.entity";
import { Zones } from "./zones.entity";


@Table({
    tableName: 'regions', 
    timestamps: true,
    createdAt: false,
    updatedAt: false,

})
export class Regions extends Model<Regions>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER, 
        allowNull: false, 
        field: 'idRegion'
    })
    idRegion: number;

    @ForeignKey(() => Organization) // Asumiendo que tienes una entidad Organizations que representa la tabla `organizations`
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'idOrganization'
    })
    idOrganization: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'name'
    })
    name: string;

    @BelongsTo(() => Organization)
    organization: Organization;

    @HasMany(() => Zones)
    zones: Zones[];
}