export class ServerMessage {
    error : boolean;
    message : string;
    data : any;

    constructor( err : boolean , mess : string , dat : any) {
        this.error = err;
        this.message = mess;
        this.data = dat;    
    }
}
