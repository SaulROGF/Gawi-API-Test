export class GasHistoryAdapter {
  token: string;
  consumption: number;
  datetime: Date;

  constructor( body: any) {
    this.token = body.T;
    this.consumption = parseFloat(body.A);
    this.datetime = new Date(this.formatDateTime(body.B, body.C));
  }

  public checkDatetime() {
    return Object.prototype.toString.call(this.datetime) !== '[object Date]' ||
      isNaN(this.datetime.getTime())
      ? true
      : false;
  }

  public check(): boolean {
    return this.token == undefined ||
      this.consumption == undefined ||
      this.consumption == null
      ? true
      : false;
  }

  private formatDateTime(rawDate: string, rawTime: string) {
    let year: string = '20' + rawDate.split('/')[0];
    let month: string = this.formatSettingsToString(rawDate.split('/')[1], 2);
    let day: string = this.formatSettingsToString(rawDate.split('/')[2], 2);
    let hour: string = this.formatSettingsToString(rawTime.split(':')[0], 2);
    let mins: string = this.formatSettingsToString(rawTime.split(':')[1], 2);
    let secs: string = this.formatSettingsToString(rawTime.split(':')[2], 2);
    const x = (
      year +
      '-' +
      month +
      '-' +
      day +
      'T' +
      hour +
      ':' +
      mins +
      ':' +
      secs.slice(0, 2)
    );
    console.log(x)
    return x
  }

  private formatSettingsToString(num: string, len: number) {
    let ans: string = '' + num;
    while (ans.length < len) {
      ans = '0' + ans;
    }
    return ans;
  }
}
