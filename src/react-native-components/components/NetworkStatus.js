import React, { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

function NetworkStatus({isNetConnected, setIsNetConnected, webviewRef}) {
    const unsubscribeRef = useRef(null);
    useEffect(() => {
        NetInfo.fetch().then((state) => {
        if (state.isConnected) {
            setIsNetConnected(true)
            console.log('Netconnected in Webview',true)
        } 
        unsubscribeRef.current = NetInfo.addEventListener((state) => {
          if (state.isConnected) {
            webviewRef.current.reload();
            setIsNetConnected(true)
          } 
          else if(!state.isConnected){
            setIsNetConnected(false)
            console.log('Netconnected in Webview',false)
          }
        });
        return () => {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        };
      }, []);
    })
    return null;
}

export default NetworkStatus;
