import React from 'react';
import Input from '../components/Input';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
    title: 'components|Input',
    component: Input,
    decorator: [withKnobs]
}

export const basic = () => <Input type="text"/>

basic.story = {
    name: 'Default'
}