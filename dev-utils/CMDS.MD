Para correr el repo con cambios en caliente:

    >> npm run start:dev

    >> npm run build

Comando para resetar el servidor apache para node dentro de un ssh del servidor hosting
    >> pkill -9 Passenger

Para instalar node se usa nvm y se debe instalar node v11.15.0

    >> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
    >> nvm install v11.15.0
    >> npm i -f //Esto instalara las dependencias si o si

CLI NEST:

    >> nest g module {path}/{name}
    >> nest g controller {path}/{name}
    >> ionic g service {path}/{name}
    
https://www.npmjs.com/package/sequelize-automate
Crea las entidades de las tablas contenidas en una base de datos automaticamente para usarse en sequelize

    >> sequelize-automate -t [type] -h <host> -d <database> -u <user> -p [password] -P [port]  -e [dialect] -o [/path/to/models] -c [/path/to/config]

    >> sequelize-automate -t ts -h localhost -d enbibo_sisdb -u enbibo_sokoenbi -p enbibosys2015** -P 3306  -e mysql -o ./modelos-automaticos -c ./modelos-automaticos/config

Modificaciones ya echas

TODO:

    1. - Hay que cambiar el key del jwt en las estrategias del passtport

PassengerBaseURI /
PassengerAppRoot /home/uj7o0yujixhi/admin-luu/ofi-api-sds/dist/

PassengerAppType    node
PassengerStartupFile main.js
