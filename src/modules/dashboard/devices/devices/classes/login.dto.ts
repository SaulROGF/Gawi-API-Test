export class LoginDto {
  imei: string;
  serialNumber: string; 

  constructor(body: any) {
    this.imei = body.A;
    this.serialNumber = body.B;
  }
}
