"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPushAlerts = void 0;
const getPushAlerts = (settings) => {
    return {
        0: `cambio de estado en la entrada '${settings.digitalLabel1}'`,
        1: `cambio de estado en la entrada '${settings.digitalLabel2}'`,
        2: `cambio de estado en la entrada '${settings.digitalLabel3}'`,
        3: `cambio de estado en la entrada '${settings.digitalLabel4}'`,
        4: `valor por debajo del umbral en la entrada '${settings.analogLabel1}'`,
        5: `valor por debajo del umbral en la entrada '${settings.analogLabel2}'`,
        6: `valor por debajo del umbral en la entrada '${settings.analogLabel3}'`,
        7: `valor por debajo del umbral en la entrada '${settings.analogLabel4}'`,
        8: `valor por encima del umbral en la entrada '${settings.analogLabel1}'`,
        9: `valor por encima del umbral en la entrada '${settings.analogLabel2}'`,
        10: `valor por encima del umbral en la entrada '${settings.analogLabel3}'`,
        11: `valor por encima del umbral en la entrada '${settings.analogLabel4}'`,
        12: 'flujo 1 por debajo del umbral',
        13: 'flujo 2 por debajo del umbral',
        14: 'flujo 1 por debajo del umbral',
        15: 'flujo 2 por debajo del umbral',
    };
};
exports.getPushAlerts = getPushAlerts;
//# sourceMappingURL=datalogger.utils.js.map