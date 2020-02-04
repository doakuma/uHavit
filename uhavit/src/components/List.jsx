/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const List = (props) => {

    return(
        <ul list={props.list}>
            {props.list.map(item => (
                <li key={item.makeCmtId}>
                    <span>{item.makeComment}</span>
                    <span>{item.makeCmtDate}</span>
                </li>
            ))}
        </ul>
    )

}

List.propTypes = {
    list: PropTypes.array
}

List.defaultProps = {
    list: [
        {
            makeCmtId: '00',
            makeComment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            makeCmtDate: '2020-02-04 12:12:12'
        }
    ]
}

export default List;