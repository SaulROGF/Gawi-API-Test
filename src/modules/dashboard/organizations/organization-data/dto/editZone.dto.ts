import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';


export class EditZoneDto {

    @IsOptional()
    @IsInt({message: 'Debe ser un numero entero'})
    @IsPositive({message: 'Debe ser un numero mayor a 0'})
    idRegion?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    name?: string;
}