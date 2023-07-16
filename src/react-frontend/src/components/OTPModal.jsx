import {IonLabel, IonButton, IonModal, useIonModal} from '@ionic/react';
import AuthCode from 'react-auth-code-input';
import {useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react';
import CountDownTimer from './CountDownTimer';
import useFetch from '../hooks/useFetch';

const OTPModal = ({mobile, modalVisible, handleOTPModal, setModalVisible}) => {
  const [otp, setOTP] = useState('');
  const [isRunning, setIsRunning] = useState(true);
  const [data, setData] = useState({});
  const history = useHistory();
  const {post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  ); //("http://localhost:5151/api/v1/");

  const presentModal = () => {
    post('user/registerMobile', {mobile: mobile})
      .then(data => {
        console.log(data);
        setData(data.body);
      })
      .catch(error => {
        console.log('error occurred (consoled) otp wrong/other', error);
      });
  };

  const handleOnAuthCodeChange = res => {
    setOTP(res);
    if (res.length == 6) {
      console.log('Call the Verify OTP Api');
      post('user/verifyMobileOTP', {_id: data._id, otp: res}).then(data => {
        console.log(data, '****verified****');
        localStorage.setItem('auth_token', data.body.auth_token);
        data.body.auth_token && history.push('/home');
        setModalVisible(false);
      });
    }
  };

  const handleResendOTP = () => {
    presentModal();
  };

  return (
    <IonModal
      showBackdrop="true"
      backdropDismiss="true"
      className="login-otp-box"
      isOpen={modalVisible}
      initialBreakpoint={0.5}
      breakpoints={[0.5, 1]}
      onDidPresent={presentModal}>
      {localStorage.getItem('auth_token')}
      <h4>Enter the 6 digit verification code sent to +91{mobile}</h4>
      <AuthCode
        allowedCharacters="numeric"
        onChange={handleOnAuthCodeChange}
        containerClassName="otp"
        length={6}
      />
      <IonLabel>
        Didn't receive the code? <br />
        <br />
        <IonButton
          onClick={handleResendOTP}
          disabled={isRunning}
          color="tertiary">
          Resend
        </IonButton>
        <br />
        <br />
        <CountDownTimer
          time={{seconds: 4}}
          running={isRunning}
          setRunning={setIsRunning}
        />
        {loading && <p>{loading}</p>}
      </IonLabel>
    </IonModal>
  );
};

export default OTPModal;
