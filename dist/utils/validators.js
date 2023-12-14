"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
exports.validators = {
    validateUser: (newUser) => {
        var errors = [];
        if (newUser.npassword) {
        }
        if (errors.length == 0) {
            return true;
        }
        else {
            return false;
        }
    },
    isEmail: (value) => {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(value).toLowerCase());
    },
    maxLength: (value, length) => {
        if (value.length > length) {
            return true;
        }
        return false;
    }
};
//# sourceMappingURL=validators.js.map