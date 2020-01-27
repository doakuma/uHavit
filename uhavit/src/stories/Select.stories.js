import React from 'react';
import Select from '../components/select';
import { withKnobs } from '@storybook/addon-knobs';

export default {
    title: 'components|Select',
    component: Select,
    decorators: [withKnobs]
}

export const basic = () => <Select title="Select" name="Select" />

basic.story = {
    name: 'Default'
}