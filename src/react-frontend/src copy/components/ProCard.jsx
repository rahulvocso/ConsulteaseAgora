import { IonAvatar,IonLabel, IonCardSubtitle, IonIcon, IonModal, IonNote, IonRow, useIonModal } from "@ionic/react";
import { star, bulb, micOutline, timeOutline,starOutline } from "ionicons/icons";
import { useStoreState } from "pullstate";
import {  useEffect, useState } from "react";

import { CategoryStore } from '../store';
import { getPeople } from "../store/PeopleStore";
import { getCategory } from '../store/Selectors';

import styles from "./ProCard.module.css";
import { TalkModal } from "./TalkModal";
import Avatar from 'react-avatar';
import {Link, useHistory} from "react-router-dom"; 



export const ProCard = ({ profile, pageRef }) => {

  const [ speakers, setSpeakers ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const history=useHistory();


	return (
    <>
    <Link to={"/profile/"+profile._id}>{"/profile/"+profile._id}</Link>
      <div className={ `${ styles.talkCard }` } onClick={ () => history.push("/profile/"+profile._id) }>

       <div className={ styles.proDetails }> 
          <IonAvatar  >
             
          <Avatar   
            size="80"
            round="50px"
            name={profile.fname} 
            src={profile.profile.photo} />
  
          </IonAvatar>

          <div className={ styles.talkTitle }>
          <h3>{profile.fname} {profile.lname}</h3>
          
          <div className={ styles.detailCount }>
              <IonIcon color="primary" icon={ starOutline } />
              <span>{ profile.stats.rating_average } ({ profile.otp } +) </span>

              <IonIcon color="primary" icon={ timeOutline } />
              <span>{ profile.stats.rating_average } Minutes </span>


            </div>
<br/>
             <div className={ styles.cardTitle }>
              <IonCardSubtitle color="primary">{profile.mobile}</IonCardSubtitle>
            </div>
            <IonCardSubtitle>{profile.profile.title}</IonCardSubtitle>
          </div>
          
        </div>
       
      
      </div>

      <IonModal isOpen={ showModal } onDidDismiss={ () => setShowModal(false) } presentingElement={ pageRef.current }>
        <TalkModal dismiss={ () => setShowModal(false) } speakers={ speakers } talk={ profile } category={ {} } />
      </IonModal>
    </>
	);
}