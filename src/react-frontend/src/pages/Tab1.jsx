import {
  setupIonicReact,
  IonButton,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonCardTitle,
  IonSegment,
  IonIcon,
  IonSegmentButton,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';

import RazorPay from 'razorpay';

import useFetch from '../hooks/useFetch';

import {add, remove} from 'ionicons/icons';
import TransactionCard from '../components/TransactionCard';
import '../components/Wallet.css';

const Tab1 = React.memo( () => {
  const [walletId, setWalletId] = useState('630876ba8bbefcf932188e55');
  const [balance, setBalance] = useState('***');

  const {get, loading} = useFetch('https://callingserver.onrender.com/api/v1/');
  const auth_token = localStorage.getItem('auth_token');

  const holdBalance = 0;
  const [transactionDetailsType, setTransactionDetailsType] =
    useState('allTransactions');

  const razorpay = new RazorPay({
    key_id: 'rzp_test_mUOGb0NFEQ8MKn', // Test Mode Key
    key_secret: 'rzp_live_zslrsLGbomx8uA', // Live Mode Key
  });

  const handleRazorPayCheckout = async event => {
    event.preventDefault();
    const options = {
      amount: 250, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: 0,
      partial_payment: false,
      notes: {
        key1: 'value3',
        key2: 'value2',
      },
    };

    try {
      const response = await razorpay.orders.create(options);
      const paymentId = response.id;

      const checkoutOptions = {
        key: razorpay.key_id,
        order_id: paymentId,
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        prefill: {
          name: 'John Smith',
          email: 'john@example.com',
          contact: '1234567890',
        },
        notes: {
          address: 'Hello World',
        },
        theme: {
          color: '#F37254',
        },
      };
      razorpay.checkout.open(checkoutOptions);
    } catch (error) {
      console.log(error);
    }
  };

  // sample wallet_id="630876ba8bbefcf932188e55"
  const handleAddMoney = async e => {
    const API_URL = "'https://callingserver.onrender.com/";
    e.preventDefault();
    const orderUrl = `${API_URL}order`;
    //const response = await Axios.get(orderUrl);
    const response = await get(`order`);
    console.log({response});
    const {data} = response;
    const options = {
      key: process.env.RAZOR_PAY_KEY_ID,
      name: 'Your App Name',
      description: 'Some Description',
      order_id: data.id,
      handler: async response => {
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `${API_URL}capture/${paymentId}`;
          //const captureResponse = await Axios.post(url, {});
          const captureResponse = await get(
            `wallet/getWallet?&wallet_id=${walletId}`,
            {
              auth_token: auth_token,
            },
          );
          console.log(captureResponse.data);
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: '#686CFD',
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  function getWalletBalance() {
    get(`wallet/getWallet?&wallet_id=${walletId}`, {
      auth_token: auth_token,
    }).then(data => {
      //setWalletData({ ...data.body });
      setWalletId(() => {
        return data.body._id;
      });
      // walletId === ""
      //   ? setWalletId(() => data.body._id)
      //   : setWalletId(() => "630876ba8bbefcf932188e55");
      // walletId = data.body._id;
      setBalance(data.body.balance);

      console.log(data.body._id);
    });
  }

  function handleSegmentChange(ev) {
    setTransactionDetailsType(ev.target.value);
  }

  useEffect(() => {
    //console.log("Tab1 initial data load", data.body._id);
    balance === '***' && getWalletBalance();
    // pushData();
  });

  useEffect(() => {
    // rather than undefined, send blank to get current user profile.
    // let id = params.id ? params.id : "";
  });
  useIonViewWillEnter(ev => {
    //console.log("3");
    //pushData();
    //console.log("4");
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {balance !== '***' && (
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
                        onClick={e => handleAddMoney(e)}>
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
                  onIonChange={ev => handleSegmentChange(ev)}>
                  <IonSegmentButton
                    value="allTransactions"
                    color="primary"
                    shape="round">
                    <IonLabel>All Transactions</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton
                    value="holdTransactions"
                    color="primary"
                    shape="round">
                    <IonLabel>Hold Transactions</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
                {transactionDetailsType === 'allTransactions' && (
                  <TransactionCard walletId={walletId} />
                )}
                {
                  transactionDetailsType === 'holdTransactions'
                  // && (
                  //   <TransactionCard walletId={walletId} />
                  // )
                }
              </div>
            </div>
          </IonContent>
        )}

        {/* <IonInfiniteScroll
          onIonInfinite={loadData}
          threshold="90px"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll> */}
      </IonContent>
    </IonPage>
  );

},
() => true,
);

export default Tab1;
