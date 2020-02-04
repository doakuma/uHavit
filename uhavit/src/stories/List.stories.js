import React from 'react';
import List from '../components/List'
import { withKnobs, text, radios, boolean } from "@storybook/addon-knobs";


export default {
  title: 'components|List',
  component: List,
  decorators: [withKnobs]
};

export const basic = () => {
    return(
        <List
            list={list}
        />
    )
}

const list = [
    {
        makeCmtId: '0',
        makeComment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        makeCmtDate: '2020-02-04 12:12:12'
    },
    {
        makeCmtId: '1',
        makeComment: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
        makeCmtDate: '2020-02-04 12:12:12'
    },
    {
        makeCmtId: '2',
        makeComment: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        makeCmtDate: '2020-02-04 12:12:12'
    },
    {
        makeCmtId: '3',
        makeComment: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        makeCmtDate: '2020-02-04 12:12:12'
    },
    {
        makeCmtId: '4',
        makeComment: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
        makeCmtDate: '2020-02-04 12:12:12'
    },
    {
        makeCmtId: '5',
        makeComment: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        makeCmtDate: '2020-02-04 12:12:12'
    },
]


basic.story = {
  name: 'Default',
};
