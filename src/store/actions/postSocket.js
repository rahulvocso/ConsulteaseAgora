// import useFetch from '../hooks/useFetch'
// const [get, post] = useFetch('https://callingserver.onrender.com/api/v1/')
import Utils from '../../utils';

function postSocket (profileData = {}, socketId = '', post) {
    if (profileData.profileId) {
      post(
        'user/setSocket',
        {
          'user_id': profileData.profileId,
          'socket_id': socketId,
        },
        { auth_token: profileData.auth_token },
      ).then(data => {
        console.log("\npostSocket.js response:\n", data, '\n');
        if (data.status == 200){
          Utils.logger.info(`******Successful  socket postSocket.js socket_id ${socketId} POST 200 \n`)
         } else {
            Utils.logger.error(`******Unsuccessfull  socket  postSocket.js socket_id ${socketId} POST \n`)
         }
      }).catch((error) => {
        Utils.logger.error('Error occurred during API call: postSocket.js ');
      })

    } else{
      // Utils.logger.error('\n******consultease_profile_id profileData not sent/set to database for\n');
      // console.log('socketID:', socketId, '\n profileData:', profileData, '\n')
      console.log('\n******consultease_profile_id profileData not sent/set to database for\n', 'socketID:', socketId, '\nprofileData', profileData, '\n')
    }
}

export default postSocket;



