import React from 'react';
import ReactDom from 'react-dom';

import {gameOfLife} from './game-of-life';

export class GameOfLife extends React.Component {
    
  componentDidMount() {
    gameOfLife(document.getElementById('game-of-life'), this.props.wasmPath);
  }

  render() {

    const divStyles = {
      'position': 'relative',
      'width': '80vmin',
      'height': '80vmin',
      'max-width': '750px',
      'max-height': '750px',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': '10px',
      'margin-bottom': '10px'    
    }

    // Styles for the game of life canvas
    const canvasStyles = {
      'position': 'absolute',
      'top': '60px',
      'left': '20px',
      'width': 'calc(100% - 40px)',
      'height': 'calc(100% - 80px)',
      'background': '#100707',
      'cursor': 'cell',
      'user-select': 'none',
      'image-rendering': 'pixelated'
    };

    return (
      <div style={divStyles}>
        <canvas id="game-of-life" style={canvasStyles}></canvas>
      </div>
    );
  }
}

export function render(containerElement, wasmPath) {
 ReactDOM.render(
    <GameOfLife wasmPath={wasmPath}/>,
    containerElement
);
}

