import React from "react";
import { useState, useEffect } from "react";

import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonCard,
  IonGrid,
  IonCol,
  IonRow,
  IonCardTitle,
  IonCardSubtitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";

import { add, remove } from "ionicons/icons";
//import rupeeSign from "../theme/assets/rupeeSign.svg";
//import WalletTransactions from "./WalletTransactions";
import TransactionCard from "./TransactionCard";
import "./Wallet.css";

const Wallet = ({ balance, walletId }) => {
  //const availableBalance = 0;
  const holdBalance = 0;
  const [transactionDetailsType, setTransactionDetailsType] =
    useState("allTransactions");
  //const [data, setData] = useState([]);
  //const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const handleSegmentChange = (ev) => {
    setTransactionDetailsType(ev.target.value);
  };

  return (
    <IonContent>
      <div>
        <IonCard className="balanceCard">
          <IonGrid>
            <IonRow className="walletCard">
              <IonCol className="totalAB">
                <IonCardSubtitle>
                  <b>Total Available Balance</b>
                </IonCardSubtitle>
                <IonCardTitle>{balance}</IonCardTitle>
              </IonCol>
              <IonCol className="addWithdraw-Container">
                <IonButton
                  className="addMoney"
                  expand="block"
                  shape="round"
                  color="primary"
                >
                  <IonIcon icon={add} />
                  Add Money
                </IonButton>

                {/* <IonButton
                  className="withdraw"
                  expand="block"
                  shape="round"
                  color="primary"
                >
                  <IonIcon icon={remove} />
                  Withdraw
                </IonButton> */}
              </IonCol>
            </IonRow>

            <IonRow className="showAvailHold">
              <IonCol>
                <IonCardSubtitle>Available Balance</IonCardSubtitle>
                <IonCardTitle>{balance}</IonCardTitle>
              </IonCol>
              <IonCol>
                <IonCardSubtitle>Hold Balance</IonCardSubtitle>
                <IonCardTitle>{holdBalance}</IonCardTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        {/* all transactions, hold transactions(segments) below */}
        <div>
          <IonSegment
            scrollable
            value={transactionDetailsType}
            selectOnFocus={true}
            swipeGesture={true}
            onIonChange={(ev) => handleSegmentChange(ev)}
          >
            <IonSegmentButton
              value="allTransactions"
              color="primary"
              shape="round"
            >
              <IonLabel>All Transactions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="holdTransactions"
              color="primary"
              shape="round"
            >
              <IonLabel>Hold Transactions</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {transactionDetailsType === "allTransactions" && (
            <TransactionCard walletId={walletId} />
          )}
          {
            transactionDetailsType === "holdTransactions"
            // && (
            //   <TransactionCard walletId={walletId} />
            // )
          }
        </div>
      </div>
    </IonContent>
  );
};

export default Wallet;

/*

import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList
} from '@ionic/react';
import Requests from './Requests';


function InfinityScroll() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    generateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  function generateItems() {
    let newItems = [];
      for (let i = 0; i < 8; i++) {
        newItems.push([`Item ${1 + items.length + i}`]);
      }
    //console.log(newItems,"before");
    setItems([...items, ...newItems]);
    //console.log(items,"*****items after******")
  };

  return (
    <IonContent>
      <IonList>
        {items.map((item, index) => (
          <div key={index}>
            <Requests index = {index} item={item}/>
          </div>
        ))}
      </IonList>
      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          generateItems();
          setTimeout(() => ev.target.complete(), 3000);
        }}
      >
        <IonInfiniteScrollContent loadingText="Loading, Please Wait..." loadingSpinner="bubbles"></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  );
}
export default InfinityScroll;





/*
<ion-card key={index}>
            <ion-card-header>
              <ion-card-title>Movie Title{index}{item}</ion-card-title>
              <ion-card-subtitle>Year {}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <img 
                src={'https://picsum.photos/80/80?random=' + index} 
                alt="Img Not available for this movie on OMDb" 
                width="100%"/>
            </ion-card-content>
          </ion-card>
*/
