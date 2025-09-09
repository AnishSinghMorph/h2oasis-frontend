import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from '../src/screens/LandingScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LandingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LandingScreen />
      </NavigationContainer>
    );
    
    expect(getByText('Welcome to H2Oasis')).toBeTruthy();
  });

  it('navigates to SignUp after 5 seconds', (done) => {
    render(
      <NavigationContainer>
        <LandingScreen />
      </NavigationContainer>
    );

    setTimeout(() => {
      expect(mockNavigate).toHaveBeenCalledWith('SignUp');
      done();
    }, 5100);
  }, 6000);
});
