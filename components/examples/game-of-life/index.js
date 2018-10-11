import React from 'react';
import ReactDom from 'react-dom';

import {gameOfLife} from './game-of-life';

export class Greeting extends React.Component {
    render() {
        return (<p>Hello world</p>);
    }
}

export function render(containerElement) {
 ReactDOM.render(
    <Greeting />,
    containerElement
); 
}

