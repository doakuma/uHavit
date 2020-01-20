import React from 'react';
import Button from '../components/Button'
import { withKnobs, text, radios, boolean } from "@storybook/addon-knobs";


export default {
  title: 'components|Button',
  component: Button,
  decorators: [withKnobs]
};

// export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />;

export const basic = () => <Button btnType="button" btnText="확인"></Button>

export const primary = () => {
  return(
    <Button
      btnType="button"
      btnTheme="primary"
      btnText="Primary"
    />
  )
}
basic.story = {
  name: 'test',
};
