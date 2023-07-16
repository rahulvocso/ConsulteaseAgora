import React from 'react';
import {useState, useEffect} from 'react';

import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonGrid,
  IonButtons,
  IonButton,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  call,
  play,
  pause,
  caretForward,
  caretForwardCircle,
  ellipsisHorizontal,
  callSharp,
  videocam,
} from 'ionicons/icons';

import './Inbox.css';
import inCallGreen from '../theme/assets/inCallGreen.svg';
import inMissedCallRed from '../theme/assets/missedCallRed.svg';
import outCallGreen from '../theme/assets/outCallGreen.svg';
import outMissedCallRed from '../theme/assets/outMissedCallRed.svg';
import rupeeSign from '../theme/assets/rupeeSign.svg';

import useFetch from '../hooks/useFetch';

/*Variables names for inboxCard
callIcon
callDateTime
callerName
callExpertise
callDuration
callAmount
callId
callMoreInfo
*/

const Inbox = React.memo( 
  () => {
  const [data, setData] = useState([]);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const [infinityScroll, setInfinityScroll] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [page, setPage] = useState({
    pageNumber: 0,
    pageCount: 0,
    recordCount: 0,
  });

  const handleRight = '';
  const {get, loading} = useFetch('https://callingserver.onrender.com/api/v1/');
  const auth_token = localStorage.getItem('auth_token');

  let userIsCaller;
  const [consultEaseUserId, setConsultEaseUserId] = useState(
    '6304a1e5ed3e99dae56cc062',
  );

  function loadData(ev) {
    getCallHistory();
    ev.target.complete();
    if (page.pageNumber === page.pageCount) {
      setIsInfiniteDisabled(true);
    }
  }

  function getCallHistory() {
    get(
      `call/list?pageNumber=${
        parseInt(page.pageNumber) + 1
      }&user_id=${'6304a1e5ed3e99dae56cc062'}`,
      {
        auth_token: auth_token,
      },
    ).then(data => {
      setInbox(data.body);
      //setInbox([...inbox, data.body.data]);
      setInbox(inbox.concat(data.body.data));

      setPage({
        pageNumber: data.body.pageNumber,
        pageCount: data.body.pageCount,
        recordCount: data.body.recordCount,
      });
      //setConsultEaseUserId(localStorage.getItem("consultEaseUserId"));
      console.log(
        data.body,
        'consultEaseUserId',
        auth_token,
        consultEaseUserId,
        data.body.pageCount,
      );
    });
  }
  page.pageNumber === 1 && page.recordCount > 5 && getCallHistory();

  useIonViewWillEnter(() => {
    getCallHistory();
  });

  useEffect(() => {}, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {inbox &&
            inbox.map((callRecord, index) => {
              callRecord.from_user_id === consultEaseUserId
                ? (userIsCaller = true)
                : (userIsCaller = false);
              return (
                <IonItem key={`item_${index}`}>
                  <IonGrid className="inboxCard">
                    <div className="callIcon">
                      {/* {console.log(
                        userIsCaller,
                        callRecord.from_user_id,
                        consultEaseUserId
                      )} */}
                      <IonIcon
                        icon={
                          userIsCaller
                            ? callRecord.duration === 0
                              ? outMissedCallRed
                              : outCallGreen
                            : callRecord.duration === 0
                            ? inMissedCallRed
                            : inCallGreen
                        }
                        className="callIcon-audioVideo"
                      />
                    </div>
                    <div className="callCardDetails">
                      <div className="callerName">
                        <p>
                          {userIsCaller
                            ? callRecord.to_user
                            : callRecord.from_user}
                        </p>
                      </div>

                      <div className="callExpertise">
                        <p>Consulting</p>
                      </div>

                      <div className="callDateTime">
                        <p>
                          {callRecord.createdAt.split(/[ T.]/)[0]}
                          {'; '}
                          {callRecord.createdAt.split(/[ T.]/)[1]}
                        </p>
                      </div>

                      <div className="callDuration">
                        <p>{callRecord.duration}</p>
                        <IonIcon
                          icon={
                            callRecord.type === 'Audio' ? callSharp : videocam
                          }
                          color="primary"
                          className="callIcon-audioVideo"></IonIcon>
                      </div>

                      <div className="callId">
                        <p>
                          CE#
                          {callRecord._id.substring(
                            1,
                            callRecord._id.length / 2 - 1,
                          )}
                        </p>
                        <p>
                          {callRecord._id.substring(
                            callRecord._id.length / 2 - 1,
                          )}
                        </p>
                      </div>

                      <div className="callAmount">
                        <img src={rupeeSign} />
                        <p>250</p>
                      </div>
                    </div>
                  </IonGrid>
                </IonItem>
              );
            })}
        </IonList>
        <IonInfiniteScroll
          onIonInfinite={ev => {
            loadData(ev);
            ev.target.complete();
          }}
          disabled={isInfiniteDisabled}
          threshold="30%">
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
},
() => true,
);
export default Inbox;

/*
<IonLabel className="callMoreInfo">
  <IonButtons>
    <IonButton onClick={handleRight}>
      <IonIcon size="small" icon={ellipsisHorizontal} />
    </IonButton>
  </IonButtons>
</IonLabel>
*/
