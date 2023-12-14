from colorama import Fore
from datetime import date, datetime
import requests, time



  #  private fixLenWithZero(num: number, len: number) {
  #    let ans: string = '' + num;
  #    while (ans.length < len) {
  #      ans = '0' + ans;
  #    }
  #    return ans;
  #  }


def padding(num: int, size: int = 2) -> str:
    ans: str = f"{num}"
    while len(ans) < size:
        ans = f"0{ans}"
    return ans


def test_alerts(minFilling=15, interval=10, local=True) -> None:
    now: datetime = datetime.now()

    apiUrl: str = "localhost:3002" if local else "api.gawi.mx"
    A=f"{now.year}-{padding(now.month)}-{padding(now.day)}"  # (A) Fecha (dd/mm/aaaa)
    B=f"{padding(now.hour)}:{padding(now.minute)}"           # (B) Hora (hr:mm)
    C=864475044133568   # (C) IMEI (15 dígitos)
    D="02042186"        # (D) Número de serie (LONGITUD POR DEFINIR)
    E=10                # (E) % Medición (3-5 caracteres)
    F=25                # (F) % Consumo promedio por hora (hasta 5 caracteres)
    G=60                # (G) Temperatura (Hasta 1-3 caracteres)  
    I=99                # (I) % Batería (Hasta 1-3 caracteres
    J=25                # (J) temperatura
    K=31                # (K) calidad de señal
    # measures = [100, 95, 90, 85, 70, 75, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5]

    # print(A, B)
    
    measures: list = [27]
    measures.reverse()
    print("\n")
    for (idx, mes) in enumerate(measures):
        # (H) Alarmas
        a, b, c = 0, 0, 0
        if mes <= minFilling: a = 1
        if mes%interval == 0: b = 1
        H: str = f"{a}{b}{c}"
        E: int = mes
        print("  " if H == "000" else ("* " if H == "010" else ("+ " if H == "100" else "*+")), end=" ")
        print(Fore.RED + f"{idx}: " + Fore.YELLOW + str(datetime.now().strftime("%d/%m/%Y %H:%M:%S")) + Fore.CYAN + f" %{mes}" + Fore.RESET, end=": ")
        resp: requests.Response = requests.get(url=f"http://{apiUrl}/devs/gd-save/A={A}&B={B}&C={C}&D={D}&E={E}&F={F}&G={G}&H={H}&I={I}&J={J}&K={K}")
        print(Fore.GREEN + str(resp.content) + Fore.RESET)
        time.sleep(20)
    print("\n")

if __name__ == "__main__":
    try:
        test_alerts(local=False)
    except Exception as err:
        print(err)
