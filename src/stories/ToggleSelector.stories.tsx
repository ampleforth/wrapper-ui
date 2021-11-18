import React from 'react';
import { Story, Meta } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToggleSelector, ToggleSelectorProps } from 'components/ToggleSelector';

export default {
  title: 'components/ToggleSelector',
  component: ToggleSelector,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ToggleSelectorProps> = (args) => (
  <Router>
    <ToggleSelector {...args} />
  </Router>
);

export const Primary = Template.bind({});
Primary.args = {
  optionsList: [['Borrow', 'borrow'], ['My Bonds', 'Bonds'], ['Fun Facts', 'faq']],
};
