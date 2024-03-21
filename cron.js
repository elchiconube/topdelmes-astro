import cron from 'node-cron';
import { exec } from 'child_process';

cron.schedule('0 0 * * *', () => {
  console.log('Ejecutando npm run build:sitemaps una vez al día');
  exec('npm run build:sitemaps', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return;
    }
    console.log(`Salida: ${stdout}`);
    if (stderr) {
      console.error(`Error: ${stderr}`);
    }
  });
}, {
  scheduled: true,
  timezone: "Europe/Madrid" // Zona horaria para Madrid, España
});
