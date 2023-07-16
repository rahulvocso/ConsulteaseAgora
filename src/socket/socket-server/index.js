import Utils from './src/utils';
import HTTPServer from './src/http-server';
import SocketIO from './src/socket.io';

console.log(`\n------------------\nFresh Server Start\n------------------\n`)

const now = new Date();
const currentTime = now.toLocaleTimeString();
const currentDay = now.getDay();
const currentDate = now.getDate();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const weekDay = ['Mon','Tue','Wed','Thurs','Fri','Sat','Sun']
const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']

console.log(`Time: ${currentTime}`)
console.log(`Date: ${weekDay[currentDay-1]}, ${currentDate} ${months[currentMonth]} ${currentYear} \n`)
// Utils.logger.info(`Time: ${currentTime}`);
// Utils.logger.info(`Date: ${weekDay[currentDay-1]}, ${currentDate} ${months[currentMonth]} ${currentYear}`)


Utils.logger.info(`Socket Server ConsulteaseAgora`);

const init = async () => {
  await HTTPServer.init();
  await SocketIO.init({
    httpServer: HTTPServer.server,
  });
};

init().then(() => {
  Utils.logger.info('init complete');
});

































