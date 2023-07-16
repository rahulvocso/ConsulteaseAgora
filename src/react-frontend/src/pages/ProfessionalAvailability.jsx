import {IonContent, IonNote, IonPage} from '@ionic/react';
import {
  IonList,
  IonIcon,
  IonToggle,
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  useIonToast,
} from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/react';

import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Header} from '../components/Header';
import useFetch from '../hooks/useFetch';
import './ProfessionalAvailability.css';

import DayCard from '../components/DayCard';
import TimePicker from '../components/TimePicker';

import {checkmarkCircleOutline, warningOutline} from 'ionicons/icons';

const ProfessionalAvailability = () => {
  // template data
  const [days, setDays] = useState([]);

  const history = useHistory();
  const [presentToast] = useIonToast();

  const [vacationMode, setVacationMode] = useState(false);
  const [alwaysOnMode, setAlwaysOnMode] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const [timePicker, setTimePicker] = useState({
    visible: false,
    daykey: null,
    slot: {},
  });

  const {get, post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );

  useEffect(() => {
    // fetch current schedule data info
    setSchedule([...days]);

    get('user/', {auth_token: localStorage.getItem('auth_token')}).then(
      data => {
        setVacationMode(data.body.profile.vacation);
        setAlwaysOnMode(data.body.profile.alwaysAvailable);

        const newData = [...data.body.profile.schedule];
        setSchedule(newData);
      },
    );
  }, []);

  // for updating
  // vacation
  // call me anytime settings...
  const handleModeUpdate = e => {
    if (e.target.field == 'profile.vacation') setVacationMode(e.target.checked);
    else if (e.target.field == 'profile.alwaysAvailable')
      setAlwaysOnMode(e.target.checked);

    console.log('Key ', e.target.field, e.target.checked);
    post(
      'user/updateUserMeta',
      {
        key: e.target.field,
        value: e.target.checked,
      },
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

  const handleSetDayAvailable = (e, day, daykey) => {
    const newData = [...schedule];
    newData[daykey] = {...day, isAvailable: e.target.checked};
    setSchedule(newData);
  };

  const handleShowTimePicker = (e, day, daykey) => {
    setTimePicker(timePicker => ({
      ...timePicker,
      daykey: daykey,
      visible: true,
    }));
    console.log('showing time slot form', 'timePicker', timePicker);
  };

  // to be continued from here...
  const handleAddSlot = slot => {
    const newData = [...schedule];
    newData[timePicker.daykey]['slots'] = [
      ...newData[timePicker.daykey].slots,
      slot,
    ];
    //console.log("handleAddSlot in ProfessAvail.jsx", newData, "slots", slot);
    setSchedule(newData);
  };

  const handleDeleteSlot = (e, code, key) => {
    // perfect example of removing an elements from object array in immutable way
    const newData = [...schedule];
    newData.map((day, key2) => {
      if (code == day.code) {
        let slots = [...newData[key2].slots];
        newData[key2].slots = [...slots.slice(0, key), ...slots.slice(key + 1)];
      }
    });
    setSchedule([...newData]);
  };

  // for updating
  // Schedule
  const handleSave = e => {
    console.log('Schedule ', schedule);
    post(
      'user/updateProfessionalSchedule',
      {
        schedule: schedule,
      },
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
      history.push('/profile');
    });
  };

  return (
    <IonPage>
      <Header
        type="accountwizard"
        title="Availability Schedule"
        handleRight={handleSave}
      />

      <IonContent>
        <IonRow>
          <IonCol className="availability">
            <IonCard color={vacationMode && 'danger'}>
              <IonCardHeader>
                <IonToggle
                  color="light"
                  checked={vacationMode}
                  onIonChange={e => handleModeUpdate(e)}
                  key="vacation"
                  field="profile.vacation"
                />

                <IonCardTitle color={vacationMode && 'danger'}>
                  Vacation Mode
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {!vacationMode && (
                  <IonLabel>
                    Choose this if you are not available to take calls.
                  </IonLabel>
                )}
                {vacationMode && (
                  <IonLabel>
                    You won't get any calls. Switch it back when you're ready to
                    take calls.
                  </IonLabel>
                )}
              </IonCardContent>
            </IonCard>
            <IonCard disabled={vacationMode}>
              <IonCardHeader>
                <IonToggle
                  checked={alwaysOnMode}
                  onIonChange={e => handleModeUpdate(e)}
                  key="alwaysAvailable"
                  field="profile.alwaysAvailable"
                />

                <IonCardTitle>Call me anytime</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {!alwaysOnMode && (
                  <IonLabel>
                    Select your availability time slots below or just{' '}
                    <b>Switch On</b> Call me anytime.
                  </IonLabel>
                )}
                {alwaysOnMode && (
                  <IonLabel>
                    People can call you any time. Switch it off if you would
                    like to set your own availability time slots.
                  </IonLabel>
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="availability">
            {!vacationMode &&
              alwaysOnMode == false &&
              schedule.map((day, key) => (
                <div key={key}>
                  <DayCard
                    day={day}
                    daykey={key}
                    key={day.code}
                    handleSetDayAvailable={handleSetDayAvailable}
                    handleShowTimePicker={handleShowTimePicker}
                    handleDeleteSlot={handleDeleteSlot}
                  />
                </div>
              ))}
          </IonCol>
        </IonRow>
      </IonContent>
      <IonButton
        disabled={false}
        className="ion-margin"
        onClick={e => handleSave(e)}>
        Save & Continue
      </IonButton>

      <TimePicker
        timePicker={timePicker}
        setTimePicker={setTimePicker}
        handleAddSlot={handleAddSlot}
      />
    </IonPage>
  );
};

export default ProfessionalAvailability;
