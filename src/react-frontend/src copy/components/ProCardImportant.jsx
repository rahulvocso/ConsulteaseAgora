import { IonAvatar,IonLabel, IonCardSubtitle, IonIcon, IonModal, IonNote, IonRow, useIonModal } from "@ionic/react";
import { star, bulb, micOutline, personOutline,starOutline } from "ionicons/icons";
import { useStoreState } from "pullstate";
import { useEffect, useState } from "react";

import { CategoryStore } from '../store';
import { getPeople } from "../store/PeopleStore";
import { getCategory } from '../store/Selectors';

import styles from "./ProCard.module.css";
import { TalkModal } from "./TalkModal";

export const ProCardImportant = ({ profile, pageRef }) => {

//	const talkCategory = useStoreState(CategoryStore, getCategory(profile.category_id));
  const [ speakers, setSpeakers ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);

  useEffect(() => {

    setSpeakers(getPeople(""));
    console.log(profile.profile.title);
  }, [ profile ]);

  

  // const [ present, dismiss ] = useIonModal(TalkModal, {

  //   dismiss: () => dismiss(),
  //   talk,
  //   speakers,
  //   category: talkCategory
  // });

	// const handleShowTalk = () => {

  //   console.log("in here");

	// 	present({
	
	// 	  // presentingElement: pageRef.current
	// 	});
	// }

	return (
    <>
      <div className={ `${ styles.proCardImportant }` } onClick={ () => setShowModal(true) }>

       <div className={ styles.proDetails }> 
          <IonAvatar className="item-avatar-important">
            <img src={profile.profile.photo} />
          </IonAvatar>
          
        </div>
       
      
      </div>
     
    </>
	);
}