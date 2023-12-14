from colorama import Fore
from datetime import datetime
import requests, time
from random import random, uniform


def test_travel_mode(minFilling=15, interval=10):
    A='2021-04-08'      # (A) Fecha (dd/mm/aaaa)
    B='04:20'           # (B) Hora (hr:mm)
    C=864475044160108   # (C) IMEI (15 dígitos)
    D=45303134          # (D) Número de serie (LONGITUD POR DEFINIR)
    E=10                # (E) % Medición (3-5 caracteres)
    F=25                # (F) % Consumo promedio por hora (hasta 5 caracteres)
    G=60                # (G) Temperatura (Hasta 1-3 caracteres)  
    I=99                # (I) % Batería (Hasta 1-3 caracteres
    J=25                # (J) temperatura
    K=31                # (K) calidad de señal

    measures = [45.2 for _ in range(10)] + [round(uniform(45.1, 45.3), 2) for _ in range(5)]

    print(measures)

    for (idx, mes) in enumerate(measures):
        # (H) Alarmas
        a, b, c = 0, 0, 0
        if mes <= minFilling: a = 1
        if mes%interval == 0: b = 1
      
        H = f"{a}{b}{c}"
        E = mes
        print("  " if H == "000" else ("* " if H == "010" else ("+ " if H == "100" else "*+")), end=" ")
        print(Fore.RED + f"{idx}: " + Fore.YELLOW + str(datetime.now().strftime("%d/%m/%Y %H:%M:%S")) + Fore.CYAN + f" %{mes}" + Fore.RESET, end=": ")
        resp = requests.get(url=f"http://api-test.gawi.mx/devs/gd-save/A={A}&B={B}&C={C}&D={D}&E={E}&F={F}&G={G}&H={H}&I={I}&J={J}&K={K}")
        print(Fore.GREEN + str(resp.content) + Fore.RESET)
        time.sleep(20)
    print("\n")

if __name__ == "__main__":
    try:
        test_travel_mode()
    except Exception as err:
        print(err)
