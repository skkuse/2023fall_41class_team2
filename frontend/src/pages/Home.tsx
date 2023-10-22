// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import './Home.scss';
// import { useRecoilState } from 'recoil';
// import testState from '@/recoil/atoms/TestState';
import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { java } from '@codemirror/lang-java';
import { useRecoilState } from 'recoil';
import javaState from '@/recoil/atoms/JavaState';

const runJava = async (code: string) => {
  const { data } = await axios.post('/api/carbon_emission_calculate', {
    req_code: code,
  });
  return data;
};

function Home() {
  const [code, setCode] = useState('');
  const [result, setResult] = useRecoilState(javaState.result);

  const onChange = (value: string) => {
    setCode(value);
  };

  const runJavaMutation = useMutation(runJava, {
    onSuccess: (data) => {
      setResult({
        ...data,
      });
    },
  });

  const handleClick = () => {
    runJavaMutation.mutate(code);
  };

  return (
    <div className="home">
      <div className="home_container">
        <CodeMirror
          value={code}
          onChange={onChange}
          className="home_editor"
          theme={vscodeDark}
          height="100%"
          extensions={[java()]}
        />
        <div className="home_result">
          <div className="home_result_item">
            carbon emissions (gram) : {result.carbon_emissions}
          </div>
          <div className="home_result_item">
            energy needed (kWh) : {result.energy_needed}
          </div>
          <div className="home_result_item">
            user time (sec) : {result.user_time}
          </div>
          <div className="home_result_item">
            cpu (core usage) : {result.cpu_core_use}
          </div>
          <div className="home_result_item">
            memory (KB) : {result.memory_usage}
          </div>
        </div>
        <button onClick={handleClick}>Click</button>
      </div>
    </div>
  );
}

export default Home;
