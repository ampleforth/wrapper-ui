import React from 'react';
import { Story, Meta } from '@storybook/react';
import { InfoBubble, InfoBubbleProps } from 'components/InfoBubble';

export default {
  title: 'components/InfoBubble',
  component: InfoBubble,
} as Meta;

const Template: Story<InfoBubbleProps> = (args) => (
  <div style={{ height: 100 }}>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      Hello
      <InfoBubble {...args} />
    </div>
  </div>
);

export const main = Template.bind({});
main.args = {
  message: 'Info Bubble Pop-up message!',
};
