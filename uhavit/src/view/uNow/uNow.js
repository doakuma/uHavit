import React, { Component }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import List from '../../components/List';

const UNow = (props) => {
    
const dummy = {
	makeDuration: true,
	makeDurDate: '00',
	makeCmtList: [
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
	],
	makeDurList: [
		{
			makeDurId: '00',
			makeDuration: true,
			makeDurDate: '00',
			makeDurAmount: '00' // makeEndDate - makeStartDate
		}
	]
}
    return (
        <Container>
            <Title
                level={2}
                text="UNow"
            />
            <div>
                <strong>00</strong>일 째 만드는 중
            </div>
            <div>chart Area</div>
            <div>
                <List
                    list={dummy.makeCmtList}
                />
            </div>
            
        </Container>
    )
}

export default UNow;
