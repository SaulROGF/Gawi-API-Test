"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaSkillModule = void 0;
const auth_module_1 = require("./../../../public/auth/auth.module");
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../../../database/database.module");
const global_services_module_1 = require("../../../global/global-services.module");
const user_providers_1 = require("./../../../../models/repositoriesModels/user.providers");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const alexaSkill_service_1 = require("./alexaSkill.service");
const alexaSkill_controller_1 = require("./alexaSkill.controller");
const devices_module_1 = require("../devices/devices.module");
const user_module_1 = require("../../../public/user/user.module");
let AlexaSkillModule = class AlexaSkillModule {
};
AlexaSkillModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DatabaseModule,
            global_services_module_1.GlobalServicesModule,
            auth_module_1.AuthModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: 'ingMultiKey',
                signOptions: {
                    expiresIn: 15 * 60
                }
            }),
            devices_module_1.DevicesModule,
            user_module_1.UserModule,
        ],
        controllers: [alexaSkill_controller_1.AlexaSkillController],
        providers: [
            alexaSkill_service_1.AlexaSkillService,
            ...user_providers_1.userProviders,
        ],
    })
], AlexaSkillModule);
exports.AlexaSkillModule = AlexaSkillModule;
//# sourceMappingURL=alexaSkill.module.js.map