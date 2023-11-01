import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubmitButton } from 'components/SubmitButton';

test('renders submit button', () => {
  render(<SubmitButton label='submit' />);
  const submitButton = screen.getByText(/submit/i);
  expect(submitButton).toBeInTheDocument();
});

test('fires callback on click', () => {
  const clickHandler = jest.fn();
  render(<SubmitButton clickHandler={clickHandler} label='submit' />);
  const submitButton = screen.getByText(/submit/i);
  fireEvent.click(submitButton);
  expect(clickHandler).toHaveBeenCalled();
});

test('it should be disabled', () => {
  const clickHandler = jest.fn();
  render(<SubmitButton clickHandler={clickHandler} label='submit' disabled />);
  const submitButton = screen.getByText(/submit/i);
  const button = screen.getByRole('button');

  fireEvent.click(submitButton);
  expect(clickHandler).not.toHaveBeenCalled();
  expect(button).toBeDisabled();
});
