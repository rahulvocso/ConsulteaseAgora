import React, {useState, useEffect} from "react";

import { NetInfo } from 'react-native';
import VIForegroundService from '@voximplant/react-native-foreground-service';

const checkInternetConnection = async () => {


    const channelConfig = {
        id: 'channelId',
        name: 'Channel name',
        description: 'Channel description',
        enableVibration: false
    };
    await VIForegroundService.getInstance().createNotificationChannel(channelConfig);
      

    const isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
        const notificationConfig = {
        channelId: 'channelId',
        id: 3456,
        title: 'Title',
        text: 'Some text',
        icon: 'ic_icon',
        button: 'Some text',
        };
        try {
        await VIForegroundService.getInstance().startService(notificationConfig);
        } catch (e) {
        console.error(e);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
          checkInternetConnection();
        }, 10000);
        return () => clearInterval(interval);
      }, []);
      
};

