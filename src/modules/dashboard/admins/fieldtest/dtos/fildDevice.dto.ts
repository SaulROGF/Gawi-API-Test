import { ArrayNotEmpty, IsArray, IsString, MaxLength, MinLength } from "class-validator";

export class FieldDeviceDto{

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    @MinLength(8, {each: true}) 
    @MaxLength(8, {each: true})
    serialNumbers: string[];
}