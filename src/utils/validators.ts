
import { CreateUserDto } from '../modules/public/user/dto/createUser.dto';

export const validators = {
  validateUser: (newUser: CreateUserDto) => {
    var errors = [];

    if (newUser.npassword) {

    }

    if (errors.length == 0) {
      return true;
    } else {
      return false;
    }
  },
  isEmail: (value: string)=>{
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  },
  maxLength: (value : string, length : number)=>{
    if(value.length > length){
      return true;
    }
    return false;
  }
};