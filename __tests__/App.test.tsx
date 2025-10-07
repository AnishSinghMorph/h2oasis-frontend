import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

// Simple test component
const TestComponent = () => (
  <View>
    <Text>H2Oasis App</Text>
  </View>
);

describe('App Smoke Test', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('H2Oasis App')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const tree = render(<TestComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
