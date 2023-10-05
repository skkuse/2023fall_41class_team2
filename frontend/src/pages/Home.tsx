// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import './Home.scss';
// import { useRecoilState } from 'recoil';
// import testState from '@/recoil/atoms/TestState';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

function Home() {
  return (
    <div className="home">
      <div className="home_container">
        <CodeMirror className="home_editor" theme={vscodeDark} height="100%" />
      </div>
    </div>
  );
}

export default Home;
