import React from 'react';
import Button from '../components/Button'
import { withKnobs, text, radios, boolean } from "@storybook/addon-knobs";


export default {
  title: 'components:Button',
  component: Button,
};

// export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />;

Button.story = {
  name: 'test',
};
