export class ServerResponseDto {
    error: boolean;
    message: string;
    data: {};

    constructor( err : boolean , mess : string , dat : any){
        this.error=err;
        this.message=mess;
        this.data=dat;
    }
  }