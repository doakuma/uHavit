import React from 'react';
import Checkbox from '../components/CheckBox';
import { withKnobs } from '@storybook/addon-knobs';

export default {
    title: 'components|Checkbox',
    component: Checkbox,
    decorators: [withKnobs]
}

export const basic = () => <Checkbox title="checkbox" name="checkbox" />

basic.story = {
    name: 'Default'
}