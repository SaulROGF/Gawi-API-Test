/**
   * Formatear una fecha proporcionada al UTC del servidor
   * @param date fecha proporcionada
   * @returns fecha formateada
   */
export function createDateAsUTC(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
};

/**
  * Aplicar el offset de la zona horaria a una fecha determinada
  * @param date fecha proporcionada
  * @returns fecha formateada
  */
export function toLocalTime(now: Date) {
  const segsInMS = 60000;
  const offset = segsInMS * now.getTimezoneOffset();
  now.setTime(now.getTime() - offset);
  return now;
};

/**
  * Obtener el día siguiente de una fecha determinada
  * @param date fecha proporcionada
  * @returns fecha formateada
  */
export function getTomorrow(now: Date) {
  let tomorrow = now;
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

//
// forzar fecha a la zona horaria de chihuahua
// solo para referencia: su uso está DEPRECADO
//
export function convertDateAsUTCForceCuu(date: Date) {
  let utc = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );

  return new Date((typeof utc === "string" ? new Date(utc) : utc)
                  .toLocaleString("en-US", { timeZone: 'America/Chihuahua' }));
}
