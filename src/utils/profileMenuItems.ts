import { MenuItem } from '../types/ProfileScreen.types';

export const getGeneralMenuItems = (navigation: any): MenuItem[] => [
  {
    id: 'account',
    icon: 'person-outline',
    iconType: 'ionicons',
    label: 'Manage Account',
    onPress: () => console.log('Manage Account'),
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    iconType: 'ionicons',
    label: 'Push notifications',
    onPress: () => console.log('Push notifications'),
  },
  {
    id: 'email',
    icon: 'mail-outline',
    iconType: 'ionicons',
    label: 'Email preferences',
    onPress: () => console.log('Email preferences'),
  },
  {
    id: 'app',
    icon: 'apps-outline',
    iconType: 'ionicons',
    label: 'App preferences',
    onPress: () => console.log('App preferences'),
  },
  {
    id: 'cache',
    icon: 'layers-outline',
    iconType: 'ionicons',
    label: 'Cache',
    onPress: () => navigation.navigate('CacheManagement' as never),
  },
  {
    id: 'device',
    iconType: 'image',
    imageSource: require('../../assets/newDevice.png'),
    label: 'New Device',
    onPress: () => console.log('New Device'),
  },
  {
    id: 'product',
    iconType: 'image',
    imageSource: require('../../assets/newProduct.png'),
    label: 'New Product',
    onPress: () => console.log('New Product'),
  },
];

export const supportMenuItems: MenuItem[] = [
  {
    id: 'feedback',
    icon: 'create-outline',
    iconType: 'ionicons',
    label: 'Send feedback',
    onPress: () => console.log('Send feedback'),
  },
  {
    id: 'rate',
    icon: 'star-outline',
    iconType: 'ionicons',
    label: 'Rate the H2Oasis',
    onPress: () => console.log('Rate the H2Oasis'),
  },
  {
    id: 'visit',
    iconType: 'image',
    imageSource: require('../../assets/h2oasisSettings.png'),
    label: 'Visit H2Oasis.ai',
    onPress: () => console.log('Visit H2Oasis.ai'),
  },
  {
    id: 'legal',
    icon: 'document-text-outline',
    iconType: 'ionicons',
    label: 'Legal',
    onPress: () => console.log('Legal'),
  },
  {
    id: 'about',
    icon: 'information-circle-outline',
    iconType: 'ionicons',
    label: 'About',
    onPress: () => console.log('About'),
  },
];
