import {
  IonAvatar,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
  IonModal,
  IonNote,
  IonRow,
  IonList,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonGrid,
  IonCol,
} from "@ionic/react";
import {
  star,
  bulb,
  micOutline,
  timeOutline,
  starOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { ReviewCard } from "../components/ReviewCard";

import styles from "./Reviews.module.css";
import Avatar from "react-avatar";
import { Link, useHistory } from "react-router-dom";

import useFetch from "../hooks/useFetch";

const Reviews = React.memo(
  () => {
    const auth_token = localStorage.getItem("auth_token");
    const { get, loading } = useFetch("http://localhost:5151/api/v1/");
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState({ pageNumber: 0 });
    const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

    const getData = () => {
      get(
        `call/list?user_id=${""}&pageNumber=${
          parseInt(page.pageNumber) + 1
        }&sort=stats.rating_average&sort_type=1`,
        { auth_token: auth_token }
      ).then((data) => {
        setProfiles([...profiles, ...data.body.data]);
        setPage({
          pageNumber: data.body.pageNumber,
          pageCount: data.body.pageCount,
          recordCount: data.body.recordCount,
        });
      });
    };

    const loadData = (ev) => {
      getData();
      ev.target.complete();
      if (page.pageNumber === page.pageCount) {
        // setInfiniteDisabled(true);
      }
    };
    useIonViewWillEnter((ev) => {
      getData();
    });

    return (
      <IonList>
        <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
          <IonRow>
            <IonCol size="12">
              {profiles.map((profile, _id) => {
                return (
                  <ReviewCard
                    key={_id}
                    profile={profile}
                    setInfiniteDisabled={setInfiniteDisabled}
                  />
                );
              })}

              <br />
              <br />
              <br />

              <IonInfiniteScroll
                onIonInfinite={loadData}
                threshold="0px"
                disabled={isInfiniteDisabled}
              >
                <IonInfiniteScrollContent
                  loadingSpinner="bubbles"
                  loadingText="Loading more data..."
                ></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
    );
  },
  () => true
);
export default Reviews;
