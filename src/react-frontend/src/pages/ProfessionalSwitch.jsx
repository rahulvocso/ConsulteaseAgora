import {IonButton, IonContent, IonNote, IonPage} from '@ionic/react';
import {
  IonSelect,
  IonSelectOption,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import proBadge from '../theme/assets/user1.svg';

import {
  personOutline,
  callOutline,
  checkmarkCircleOutline,
  warningOutline,
} from 'ionicons/icons';

import React, {Link, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Header} from '../components/Header';
import useFetch from '../hooks/useFetch';

import './ProfessionalSwitch.css';

const ProfessionalSwitch = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [data, setData] = useState({
    fname: '',
    lname: '',
    mobile: '',
  });

  const {get, post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );

  useEffect(() => {
    // fetch current personal info
    get('user/', {auth_token: localStorage.getItem('auth_token')}).then(
      data => {
        // populate info in form
        setData({
          fname: data.body.fname,
          lname: data.body.lname,
          mobile: data.body.mobile,
        });
      },
    );
  }, []);

  const handleChange = e => {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  };

  const handleSave = res => {
    //console.log("Call the Update User API",localStorage.getItem("auth_token"))
    post(
      'user/updateProfessionalCategories',
      {fname: data.fname, lname: data.lname},
      {auth_token: localStorage.getItem('auth_token')},
    ).then(data => {
      //console.log(data);
      if (data.status == 200)
        presentToast({
          message: data.message,
          icon: checkmarkCircleOutline,
          tramslucent: true,
          duration: 2000,
          color: 'primary',
        });
      else
        presentToast({
          message: data.message,
          duration: 4000,
          icon: warningOutline,
          color: 'danger',
        });
    });
  };

  const handleClose = res => {
    history.push('/home');
  };

  return (
    <IonPage>
      <Header
        type="general"
        title="Switch to Professional"
        handleLeft={handleClose}
      />

      <IonContent>
        <IonRow>
          <IonCol className="switch">
            <IonImg className="image" src={proBadge} />

            <h4>Offer advice & earn money</h4>
            <p>
              I’m doing some research into where agencies are focusing their
              time and effort this Q4. I’ll be sharing a write up/analysis with
              everyone.
            </p>
            <section>
              <ul>
                <li>Build your professional profile</li>
                <li>Offer advice in area of your expertise</li>
                <li>Set your own rates & availabilities</li>
                <li>Get paid via app</li>
              </ul>
            </section>

            <IonButton href="/procats" shape="round" expand="full">
              Continue
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default ProfessionalSwitch;
