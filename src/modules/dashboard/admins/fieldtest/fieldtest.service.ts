import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Device } from 'src/models/device.entity';
import { FieldDevice } from 'src/models/fieldDevice.entity';
import { FieldDeviceDto } from './dtos/fildDevice.dto';
import { ServerMessage } from 'src/classes/ServerMessage.class';
import { WaterHistory } from 'src/models/waterHistory.entity';

@Injectable()
export class FieldtestService {

    constructor(
        @Inject('FieldDeviceRepository')
        private readonly fieldDeviceRepository: typeof FieldDevice,

        @Inject('DeviceRepository')
        private readonly deviceRepository: typeof Device,

        @Inject('WaterHistoryRepository')
        private readonly waterHistoryRepository: typeof WaterHistory,
    ) {

    }

    /**
     * getDevicesInField
     */
    public async getDevicesInField() {

        //PASO 1: TRAER TODOS LOS DISPOSITIVOS EN FIELDDEVICE
        const fieldDevices: FieldDevice[] = await this.fieldDeviceRepository.findAll();
        
        //Paso 2: Traer todos los dispositivos planos de DEVICES
        let devices: Device[] = [];
        for (const field of fieldDevices) {
            const device = await this.deviceRepository.findOne({
                where: {
                    idDevice: field.idDevice
                }
            })
            devices.push(device);
        }  

        //Paso 3: Traer el ultimo historial de cada uno
        
        const lastHistoryMap = new Map<number, WaterHistory>();
        
        for (const fieldDevice of fieldDevices) {
            
            const history = await this.waterHistoryRepository.findOne({
                where: {
                    idDevice: fieldDevice.idDevice,
                },
                order: [['dateTime', 'DESC']],
                limit: 1,
            });
            
            if (history) {
                lastHistoryMap.set(fieldDevice.idDevice, history); 
            }
            
        }
        
        //Paso 4: Traer los ultimos 2 historiales con reason 2 
        const lasTwoReason2HistoryMap = new Map<number, WaterHistory[]>();

        for (const fieldDevice  of fieldDevices) {
            const history = await this.waterHistoryRepository.findAll(({
                where: {
                    idDevice: fieldDevice.idDevice,
                    reason: 2,
                },
                order: [['dateTime', 'DESC']], 
                limit: 2,
            }))

            lasTwoReason2HistoryMap.set(fieldDevice.idDevice, history)
        }
        //Paso 5: Crear respuesta final
        const response: any[] = [];
        for (const device of devices) {
            const deviceData: any = {
            serialNumber: device.serialNumber,
            name: device.name,
            boardVersion: device.boardVersion,
            firmwareVersion: device.firmwareVersion,
            lastTransmissionDate: null,
            activeAlarms: {},
            consumptionDifference: null,
            signalQualityAverage: null,
            transmittedLast24Hours: false,
            };

            const lastHistory = lastHistoryMap.get(device.idDevice);
            if (lastHistory) {
            deviceData.lastTransmissionDate = lastHistory.dateTime;
            deviceData.activeAlarms = {
                bubbleAlert: lastHistory.bubbleAlert,
                burstAlert: lastHistory.burstAlert,
                dripAlert: lastHistory.dripAlert,
                emptyAlert: lastHistory.emptyAlert,
                manipulationAlert: lastHistory.manipulationAlert,
                reversedFlowAlert: lastHistory.reversedFlowAlert,
            };
            }

            const lastTwoReason2History = lasTwoReason2HistoryMap.get(device.idDevice);
            if (lastTwoReason2History && lastTwoReason2History.length === 2) {
            const consumptionDifference =
                lastTwoReason2History[1].consumption - lastTwoReason2History[0].consumption;
            deviceData.consumptionDifference = consumptionDifference;

            const signalQualitySum =
                lastTwoReason2History[0].signalQuality + lastTwoReason2History[1].signalQuality;
            const signalQualityAverage = signalQualitySum / 2;
            deviceData.signalQualityAverage = signalQualityAverage;
            }

            const lastTransmissionDate = deviceData.lastTransmissionDate;
            if (lastTransmissionDate) {
            const currentDate = new Date();
            const diffInHours = (currentDate.getTime() - lastTransmissionDate.getTime()) / (1000 * 60 * 60);
            if (diffInHours <= 24) {
                deviceData.transmittedLast24Hours = true;
            }
            }

            response.push(deviceData);
        }

        return response;
    }

    /**
     * safeDeviceInField
     */
    public async saveDeviceInField(fieldDeviceDto: FieldDeviceDto): Promise<ServerMessage> {
        if (fieldDeviceDto.serialNumbers.length === 0) {
            throw new BadRequestException('La lista de números de serie está vacía');
        }
    
        const invalidSerialNumbers: string[] = [];
        const devicesToInsert: Device[] = [];
    
        for (const serialNumber of fieldDeviceDto.serialNumbers) {
            try {
                const deviceExist: Device | null = await this.findDeviceBySerialNumber(serialNumber);
    
                if (!deviceExist) {
                    invalidSerialNumbers.push(serialNumber);
                } else {
                    const deviceExistInField = await this.findFieldDeviceByDeviceId(deviceExist.idDevice);
                    if (!deviceExistInField) {
                        devicesToInsert.push(deviceExist);
                    } else {
                        invalidSerialNumbers.push(serialNumber);
                    }
                }
            } catch (error) {
                this.handleDBExceptions(error);
            }
        }
    
        if (devicesToInsert.length > 0) {
            
            try {
                for (const device of devicesToInsert) {
                    const fieldDevice: FieldDevice = new FieldDevice();
                    fieldDevice.idDevice = device.idDevice;
                    await fieldDevice.save();
                }
            } catch (error) {
                this.handleDBExceptions(error);
            }
        }
    
        if (invalidSerialNumbers.length > 0) {
            return new ServerMessage(true, `Algunos números de serie ya existen o no fueron encontrados: ${invalidSerialNumbers.join(', ')}, validos: ${devicesToInsert.join(', ')}`, 201,);
        } else {
            return new ServerMessage(false, 'Se registraron todos los dispositivos correctamente', 201);
        }
    }
    
    public async deleteDeviceFromField(serialNumbers: string): Promise<ServerMessage[]> {
        const serialNumbersArray: string[] = serialNumbers.split(',').map(serial => serial.trim());
        const deletedMessages: ServerMessage[] = [];
      
        for (const serialNumber of serialNumbersArray) {
          try {
            const deviceExist: Device = await this.findDeviceBySerialNumber(serialNumber);
            const fieldDevice = await this.findFieldDeviceByDeviceId(deviceExist.idDevice);
      
            await fieldDevice.destroy();
      
            deletedMessages.push(new ServerMessage(true, `El dispositivo con número de serie ${serialNumber} ha sido eliminado de la tabla field_devices`, 200));
          } catch (error) {
            deletedMessages.push(new ServerMessage(false, `Error al eliminar el dispositivo con número de serie ${serialNumber}`, 400));
          }
        }
        return deletedMessages;
      }

    private async findDeviceBySerialNumber(serialNumber: string): Promise<Device> {
        const deviceExist: Device = await this.deviceRepository.findOne({
            where: { serialNumber: serialNumber },
        });
        return deviceExist;
    }
    
    private async findFieldDeviceByDeviceId(deviceId: number): Promise<FieldDevice> {
        const fieldDevice = await this.fieldDeviceRepository.findOne({
            where: { idDevice: deviceId },
        });
        return fieldDevice;
    }



    private handleDBExceptions(error: any): void {
        if (error.code === 19) {
            throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    
        if (error.status === 404) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
        if (error.status === 400) {
            throw new HttpException(error.message, error.status);
        }
        throw new HttpException('Unexpected error, check server logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
