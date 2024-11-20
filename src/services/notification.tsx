

const requestNotificationPermission = async () => {
    if (Notification.permission === "granted") {
      console.log("Permiso ya concedido.");
    } else if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Permiso concedido.");
      } else {
        console.error("Permiso denegado.");
      }
    } else if (Notification.permission === "denied") {
      console.error(
        "Permiso denegado. El usuario debe habilitar manualmente las notificaciones desde la configuración del navegador."
      );
    }
  };
  
  export default requestNotificationPermission;
  