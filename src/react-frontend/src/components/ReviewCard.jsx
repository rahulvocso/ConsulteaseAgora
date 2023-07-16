import {
  IonAvatar,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
  IonModal,
  IonNote,
  IonItem,
  IonRow,
  useIonModal,
} from "@ionic/react";
import {
  time,
  star,
  bulb,
  micOutline,
  timeOutline,
  starOutline,
} from "ionicons/icons";
import { useState } from "react";

import styles from "./ReviewCard.module.css";
import Avatar from "react-avatar";
import { Link, useHistory } from "react-router-dom";

export const ReviewCard = ({ profile, setInfiniteDisabled }) => {
  const name = profile.lname + " ssss";
  let starRating = [];
  let emptyRating = [];
  for (let i = 0; i < 3; i++) {
    starRating.push(<IonIcon key={i} color="primary" icon={star} />);
  }
  for (let i = 0; i < 2; i++) {
    starRating.push(
      <IonIcon key={10 - i} color="primary" icon={starOutline} />
    );
  }

  console.log("Reviews", profile);

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewCard}>
        {console.log("reviewCard")}

        <h4 className={styles.reviewCardDateTime}>{"16 Nov 2022,12:30"}</h4>

        <IonLabel className={styles.reviewCardRow2}>
          <p className={styles.reviewCardCallId}>{`#${555452151}`}</p>
          <p className={styles.reviewCardName}>
            {profile.fname
              ? `${profile.fname[0]}****${
                  profile.lname[profile.lname.length - 1]
                }`
              : "******"}
          </p>
          <p className={styles.reviewCardCallDuration}>{"12:45"}</p>
          <div className={styles.reviewCardRatings}>
            {starRating}
            {emptyRating}
          </div>
        </IonLabel>
      </div>
    </div>
  );
};

export default ReviewCard;

/*
    <div className={`${styles.talkCard}`}>
      <div className={styles.proDetails}>
        <IonAvatar>
          <Avatar size="50" round="50px" name={profile.fname} />
        </IonAvatar>
        <div className={styles.talkTitle}>
          <h6>
            {profile.fname} {name.replaceAll(/(.*)/g, "*")}
          </h6>

          <div className={styles.detailCount}>
            <IonIcon color="primary" icon={star} />
            <IonIcon color="primary" icon={star} />
            <IonIcon color="primary" icon={star} />
            <IonIcon color="primary" icon={star} />
            <IonIcon color="primary" icon={starOutline} />
          </div>
          <div className={styles.detailCount}>
            <br />
            <br />

            <IonIcon color="primary" icon={time} />
            <span>{profile.stats.rating_average} Minutes </span>
          </div>

          <IonCardSubtitle>{profile.profile.description}</IonCardSubtitle>
          <br />
        </div>
        <br /> <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};
*/
