import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import  useBearStore  from "./state/state";

test('renders learn react link', () => {
  const isUserValid = useBearStore((state:any) => state.isUserValid);
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

