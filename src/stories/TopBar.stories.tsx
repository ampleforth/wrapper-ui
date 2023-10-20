import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TopBar, TopBarProps } from 'components/TopBar/TopBar';

export default {
  title: 'components/TopBar',
  component: TopBar,
  argTypes: {},
} as Meta;

const Template: Story<TopBarProps> = (args) => <TopBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  options: ['Google', 'Bing'],
  links: ['https://google.com', 'https://bing.com'],
};
