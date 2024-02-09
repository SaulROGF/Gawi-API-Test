import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";

// create-station.dto.ts
export class CreateStationDto {
    @IsInt({ message: 'El idOrganization debe ser un número entero.' })
    idOrganization: number;

    @IsOptional()
    @IsInt({ message: 'El idZone debe ser un número entero.' })
    idZone?: number;

    @IsNotEmpty({ message: 'El nombre no debe estar vacío.' })
    @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
    name: string;

    @IsOptional()
    @IsInt({ message: 'El supervisorId debe ser un número entero.' })
    supervisorId?: number;

    @IsOptional()
    @IsNotEmpty({ message: 'El openingTime no debe estar vacío.' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'openingTime debe ser una hora válida en formato HH:mm:ss.'
    })
    openingTime?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El closingTime no debe estar vacío.' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'closingTime debe ser una hora válida en formato HH:mm:ss.'
    })
    closingTime?: string;

    @IsOptional()
    @IsBoolean({ message: 'is24Hours debe ser un valor booleano.' })
    is24Hours?: boolean;
}


// update-station.dto.ts
export class UpdateStationDto {
    @IsOptional()
    @IsInt({ message: 'El idZone debe ser un número entero.' })
    idZone?: number;

    @IsOptional()
    @IsNotEmpty({ message: 'El nombre no debe estar vacío.' })
    @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
    name?: string;

    @IsOptional()
    @IsInt({ message: 'El supervisorId debe ser un número entero.' })
    supervisorId?: number;

    @IsOptional()
    @IsNotEmpty({ message: 'El openingTime no debe estar vacío.' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'openingTime debe ser una hora válida en formato HH:mm:ss.'
    })
    openingTime?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El closingTime no debe estar vacío.' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'closingTime debe ser una hora válida en formato HH:mm:ss.'
    })
    closingTime?: string;

    @IsOptional()
    @IsBoolean({ message: 'is24Hours debe ser un valor booleano.' })
    is24Hours?: boolean;

    @IsInt({ message: 'El idDeLaOrganización debe ser un número entero.' })
    idOrganization: number;

}