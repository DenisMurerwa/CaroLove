import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Notification Token:', token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

export const handleNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
  });

  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification Response:', response);
  });
};
