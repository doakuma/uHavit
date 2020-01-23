import React from 'react';
import TextInput from '../components/TextInput'
import { withKnobs, text, radios, boolean } from "@storybook/addon-knobs";

export default {
    title: 'components|TextInput',
    component: TextInput,
    decorators: [withKnobs]
}

export const input = () => {
    return(
        <TextInput
            type="text"
        />
    )
}

input.story = {
    name: 'text input'
}