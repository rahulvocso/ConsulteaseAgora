import {IonCard, IonContent, useIonViewWillEnter} from '@ionic/react';
import React from 'react';
import {useState, useEffect} from 'react';

import {
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';

import useFetch from '../hooks/useFetch';
import rupeeSign from '../theme/assets/rupeeSign.svg';
import rupeeSignRed from '../theme/assets/rupeeSignRed (1).svg';

import {star} from 'ionicons/icons';
import credit from '../theme/assets/creditTransaction.svg';
import debit from '../theme/assets/debitTransaction.svg';

const TransactionDetails = ({walletId}) => {
  //const [data, setData] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const {get, loading} = useFetch('https://callingserver.onrender.com/api/v1/');
  const [page, setPage] = useState({pageNumber: 0});

  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const auth_token = localStorage.getItem('auth_token');

  function loadData(ev) {
    // const newData = [];
    // for (let i = base; i < base + 10; i++) {
    //   newData.push(`Item ${i}`);
    // }
    //data.length >= 1000 && setInfinityScroll((prevState) => !prevState);
    //setData([...data, ...newData]);
    getTransactions();
    ev.target.complete();
    if (page.pageNumber === page.pageCount) {
      setIsInfiniteDisabled(true);
    }
  }

  function getTransactions() {
    get(
      `wallet/listTransactions?pageNumber=${
        parseInt(page.pageNumber) + 1
      }&wallet_id=${'630876ba8bbefcf932188e55'}`,
      {auth_token: auth_token},
    ).then(data => {
      console.log(data.body.data);
      setTransactions(transactions.concat(data.body.data));
      setPage({
        pageNumber: data.body.pageNumber,
        pageCount: data.body.pageCount,
        recordCount: data.body.recordCount,
      });
      console.log('TransactionCard transaction data... ', walletId);
      console.log(data);
    });
  }

  useIonViewWillEnter(() => {
    getTransactions();
  });

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      <IonList>
        {console.log(transactions, walletId)}
        {transactions &&
          transactions.map((transaction, index) => (
            <IonItem key={`item_${transaction._id}${index}`}>
              <IonGrid className="transactionCard">
                <div className="transactionCardList">
                  <div className="transactionCardCrDb">
                    {walletId === transaction.from_wallet ? (
                      <IonIcon icon={debit} className="debitIcon"></IonIcon>
                    ) : (
                      <IonIcon icon={credit} className="creditIcon"></IonIcon>
                    )}
                    {/* {console.log(transaction)} */}
                  </div>

                  <div className="transactionCard4">
                    <div className="transactionCardDetail">
                      <p>Calling Credits - Membership Plan</p>
                    </div>

                    <div className="transactionCardAmount">
                      <img
                        src={rupeeSign}
                        alt="rupeeSign"
                        className={
                          walletId === transaction.to_wallet ||
                          walletId !== transaction.from_wallet
                            ? 'greenRupeeSymbol'
                            : 'redRupeeSymbol'
                        }
                      />
                      <p
                        className={
                          walletId === transaction.to_wallet ||
                          walletId !== transaction.from_wallet
                            ? 'greenRupeeSymbol'
                            : 'redRupeeSymbol'
                        }>
                        {transaction.amount}
                      </p>
                    </div>

                    <div className="transactionCardDate">
                      {transaction.createdAt.split(/[ T.]/)[0]}
                      {';'}
                      <br />
                      {transaction.createdAt.split(/[ T.]/)[1]}
                    </div>

                    <div className="transactionCardToFrom">
                      {walletId === transaction.to_wallet ||
                      walletId !== transaction.from_wallet ? (
                        <p>
                          received from <b>{transaction.from_user}</b> <br />
                        </p>
                      ) : (
                        <p>
                          paid to <b>{transaction.to_user}</b>
                          <br />
                        </p>
                      )}
                    </div>

                    <div className="transactionCardId">
                      <p>CE#{transaction._id}</p>
                    </div>
                  </div>
                </div>
              </IonGrid>
            </IonItem>
          ))}
      </IonList>
      <IonInfiniteScroll
        onIonInfinite={ev => {
          loadData(ev);
        }}
        disabled={isInfiniteDisabled}>
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading"></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};

export default TransactionDetails;
