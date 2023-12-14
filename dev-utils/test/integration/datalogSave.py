import requests, time, datetime
# import matplotlib.pyplot as plt
# import numpy as np
# from random import randrange

# def getIdxs():
#     return [2**i for i in range(1, 17)]
# 
# def getSignals(LOW_SP=0.3, HIGH_SP=1.7):
#     t = np.arange(0, 2*np.pi, 0.1) # len(t, 0.05) = 126; len(t, 0.1) = 63
#     digitals = [randrange(16) for _ in range(len(t))]
#     analog1 = [round(x, 4) for x in np.sin(t) + 1]
#     analog2 = [round(x, 4) for x in np.cos(t) + 1]
#     analog3 = [round(x, 4) for x in np.sin(t + 0.5) + 1]
#     analog4 = [round(x, 4) for x in np.cos(t + 0.3) + 1]
#     lowSetpoint  = [LOW_SP  for i in range(len(t))]
#     highSetpoint = [HIGH_SP for i in range(len(t))]
#     return zip(digitals, analog1, analog2, analog3, analog4, analog1, analog2, lowSetpoint, highSetpoint)
# 
# def showSignals(LOW_SP=0.3, HIGH_SP=1.7):
#     t = np.arange(0, 2*np.pi, 0.5) # len(t, 0.05) = 126; len(t, 0.1) = 63
#     analog1 = np.sin(t) + 1
#     analog2 = np.cos(t) + 1
#     analog3 = np.sin(t + 0.5) + 1
#     analog4 = np.cos(t + 0.3) + 1
#     lowSetpoint  = [LOW_SP  for i in range(len(t))]
#     highSetpoint = [HIGH_SP for i in range(len(t))]
#     fig = plt.figure(figsize=(40, 10))
#     ax1 = plt.subplot(411)
#     ax1.plot(t, analog1, 'bo', t, lowSetpoint, 'r', t, highSetpoint, 'r')
#     ax2 = plt.subplot(412)
#     ax2.plot(t, analog2, 'go', t, lowSetpoint, 'r', t, highSetpoint, 'r')
#     ax3 = plt.subplot(413)
#     ax3.plot(t, analog3, 'co', t, lowSetpoint, 'r', t, highSetpoint, 'r')
#     ax4 = plt.subplot(414)
#     ax4.plot(t, analog4, 'ko', t, lowSetpoint, 'r', t, highSetpoint, 'r')
#     plt.show()
# 

# pa corer 
# python3 datalogSave.py

if __name__ == "__main__":
    API_URL = 'http://localhost:3000/'
    # API_URL = 'http://api-test.gawi.mx/'

    # serialNumber = 27011994
    # imei = 112233445566778
    serialNumber = 12345678
    imei = 123456789123456

    resp = requests.post(url=API_URL + 'devs/login', data={
        'A': imei,
        'B': serialNumber,
    }).json();
    print(resp)
    token = resp['message']


    now  = datetime.datetime.now()
    body = {
        'T': token,
        'A': 1,
        'B': 2,
        'C': 15,
        'D': 15,
        'E': 15,
        'F': 15,
        'G': 15,
        'H': 15,
        'I': 31,
        'J': 99,
        'K': 1,
        'L': 47,  # 41,
        'M': 157, # 253,
        'N': f'{now.hour}:{now.minute}:{now.second}',
        'O': f'22/{now.month}/{now.day}',
        'P': 1,
        'Q': 2,
        'R': 3,
        'S': 4,
    }
    # print(alerts, bin(alerts))
    resp = requests.post(url=API_URL + 'devs/dl-save', data=body).json();
    print(resp)

#    idx = getIdxs()
#    signals = getSignals()
#    for (dig, an1, an2, an3, an4, fl1, fl2, low, high) in signals:
#        alerts = 0
#
#        if (dig & 1) != 0: alerts |= 1
#        if (dig & idx[0]) != 0: alerts |= idx[0]
#        if (dig & idx[1]) != 0: alerts |= idx[1]
#        if (dig & idx[2]) != 0: alerts |= idx[2]
#        if an1 < low:  alerts |= idx[3]
#        if an2 < low:  alerts |= idx[4]
#        if an3 < low:  alerts |= idx[5]
#        if an4 < low:  alerts |= idx[6]
#        if an1 > high: alerts |= idx[7]
#        if an2 > high: alerts |= idx[8]
#        if an3 > high: alerts |= idx[9]
#        if an4 > high: alerts |= idx[10]
#        if fl1 < low:  alerts |= idx[11]
#        if fl2 < low:  alerts |= idx[12]
#        if fl1 > high: alerts |= idx[13]
#        if fl2 > high: alerts |= idx[14]
#
#        now  = datetime.datetime.now()
#        body = {
#            'T': token,
#            'A': 31,
#            'B': 99,
#            # 'C': f'0/0/0',
#            # 'D': f'0:0:0',
#            'C': f'22/{now.month}/{now.day}',
#            'D': f'{now.hour}:{now.minute}:{now.second}',
#            'E': dig,
#            'F': 0,
#            'G': an1,
#            'H': an2,
#            'I': an3,
#            'J': an4,
#            'K': fl1,
#            'L': fl2,
#            'M': 0.05,
#            'N': 0.05,
#            'O': alerts,
#        }
#        # print(alerts, bin(alerts))
#        resp = requests.post(url=API_URL + 'devs/dl-save', data=body).json();
#        print(resp)
#        break
#        time.sleep(10)
