import { FieldDevice } from "../fieldDevice.entity";


export const fieldDeviceProvider = [
  {
    provide: 'FieldDeviceRepository',
    useValue: FieldDevice,
  },
];
