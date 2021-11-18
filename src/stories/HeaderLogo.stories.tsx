import React from 'react';
import { Story, Meta } from '@storybook/react';
import { HeaderLogo } from 'components/TopBar/HeaderLogo';

export default {
  title: 'components/TopBar/HeaderLogo',
  component: HeaderLogo,
  argTypes: {
  },
} as Meta;

const Template: Story = (args) => (
  <HeaderLogo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
