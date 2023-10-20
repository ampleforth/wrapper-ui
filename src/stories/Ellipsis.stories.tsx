import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Ellipsis } from 'components/Ellipsis';

export default {
  title: 'components/Ellipsis',
  component: Ellipsis,
} as Meta;

const Template: Story = (args) => <Ellipsis {...args} />;

export const Main = Template.bind({});
Main.args = {};

export const Colored = Template.bind({});
Colored.args = {
  color: 'purple',
};
