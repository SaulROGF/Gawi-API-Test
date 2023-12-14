export declare class CreateStationDto {
    idOrganization: number;
    idZone?: number;
    name: string;
    supervisorId?: number;
    openingTime?: string;
    closingTime?: string;
    is24Hours?: boolean;
}
export declare class UpdateStationDto {
    idZone?: number;
    name?: string;
    supervisorId?: number;
    openingTime?: string;
    closingTime?: string;
    is24Hours?: boolean;
    idOrganization: number;
}
