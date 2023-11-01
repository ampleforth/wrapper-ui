import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SubmitButton, SubmitButtonProps } from 'components/SubmitButton';

export default {
  title: 'components/SubmitButton',
  component: SubmitButton,
} as Meta;

const Template: Story<SubmitButtonProps> = (args) => <SubmitButton {...args} />;

export const Main = Template.bind({});
Main.args = {
  label: 'DEPOSIT & BORROW',
  clickHandler: () => alert('Clicked!'),
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'DEPOSIT & BORROW',
  disabled: true,
  clickHandler: () => alert('Clicked!'),
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  clickHandler: () => alert('Clicked!'),
};
