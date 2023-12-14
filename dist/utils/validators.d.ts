import { CreateUserDto } from '../modules/public/user/dto/createUser.dto';
export declare const validators: {
    validateUser: (newUser: CreateUserDto) => boolean;
    isEmail: (value: string) => boolean;
    maxLength: (value: string, length: number) => boolean;
};
