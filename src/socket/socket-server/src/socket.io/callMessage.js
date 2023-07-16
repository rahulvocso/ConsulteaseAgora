import xss from 'xss';
import Utils from '../utils';

const callMessage = async ({ data, callback }) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(data.to).emit(
    'callMessage',
    // JSON.stringify({content: xss(data)})  implement this in plave of next line to sanitize data
    {content: data}   // temporary
  );
  console.log(`Message data sent to device with socket ID ${data.to}: ${data}`);
};

export default callMessage;
