import React from 'react';
import Button from '../components/Button.jsx'
import { withKnobs, text, radios, boolean } from "@storybook/addon-knobs";


export default {
  title: 'components|Button',
  component: Button,
  decorators: [withKnobs]
};

export const basic = () => <Button/>

export const primary = () => {
  return(
    <Button
      btnType="button"
      theme="primary"
      title="Primary"
    />
  )
}
basic.story = {
  name: 'Default',
};
