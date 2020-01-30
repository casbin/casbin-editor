import React from 'react';
import ReactDOM from 'react-dom';
import { EditorScreen } from './editor';
import { Footer } from './ui';
import 'normalize.css/normalize.css';

const App = () => (
  <>
    <EditorScreen />

    <Footer>
      <a target="_blank" href="https://github.com/casbin/casbin-editor">
        <img alt="GitHub stars" src="https://img.shields.io/github/stars/casbin/casbin-editor?style=social" />
      </a>
      <span style={{ color: '#FFFFFF', float: 'right', fontSize: 14 }}>Copyright © {new Date().getFullYear()} Casbin contributors.</span>
    </Footer>
  </>
);

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
