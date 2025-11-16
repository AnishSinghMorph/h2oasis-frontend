export interface UserProfile {
  name?: string;
  email?: string;
  photoURL?: string;
}

export interface MenuItem {
  id: string;
  icon?: string;
  iconType?: 'ionicons' | 'material' | 'image';
  imageSource?: any;
  label: string;
  onPress: () => void;
}
