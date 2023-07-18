import Utils from '../utils';

const callMessage = async ({ socket, data}) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(data.to).emit(
    'callMessage',
    {content: data}
  );
  console.log(`Message data sent to device with socket ID ${data.to}: ${data}`);
};

export default callMessage;
