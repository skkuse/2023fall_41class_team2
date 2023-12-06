// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import './Calculator.scss';
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
import Header from '@/components/common/Header';
import Spinner from '@/assets/Spinner.svg';

const runJava = async (code: string) => {
  const { data } = await axios.post('/api/carbon_emission_calculate', {
    req_code: code,
  });
  return data;
};

function Calculator() {
  const [code, setCode] = useState('');
  const [result, setResult] = useRecoilState(javaState.result);
  const [isLoading, setIsLoading] = useState(false);
  const onChange = (value: string) => {
    setCode(value);
  };

  const runJavaMutation = useMutation(runJava, {
    onSuccess: (data) => {
      setResult({ ...data });
      setIsLoading(false); // 결과가 도착하면 로딩 상태를 false로 변경
    },
    onError: () => {
      setIsLoading(false); // 에러 발생 시에도 로딩 상태를 false로 변경
    },
  });
  const handleClick = async () => {
    setIsLoading(true); // 버튼 클릭 시 로딩 상태를 true로 변경

    try {
      await runJavaMutation.mutate(code);
    } catch (error) {
      console.error('Error occurred: ', error);
    }
  };

  console.log(result);

  return (
    <>
      <Header type="calc" />
      <div className="calculator">
        <div className="calculator_container">
          <div className="calculator_code">
            <div className="calculator_code_title">Input your code</div>
            <div className="calculator_code_input">
              <div className="calculator_editor_header">
                <div className="editor_circle">
                  <div className="editor_circle_item red" />
                  <div className="editor_circle_item yellow" />
                  <div className="editor_circle_item green" />
                </div>
              </div>
              <CodeMirror
                value={code}
                onChange={onChange}
                className="calculator_editor"
                theme={vscodeDark}
                height="100%"
                extensions={[java()]}
              />
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="calculator_button"
              disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            >
              {isLoading ? (
                <img className="spinner" src={Spinner} alt="Loading..." />
              ) : (
                'Calculate'
              )}{' '}
              {/* 로딩 중일 때 텍스트 변경 */}
            </button>
          </div>
          <div className="calculator_result">
            <div className="calculator_result_title">Result</div>
            <div className="calculator_result_first">
              <div className="calculator_first_item">
                <div className="calculator_result_item">
                  carbon emissions (gram) : {result.carbon_emissions}
                </div>
                <div className="calculator_result_item">
                  energy needed (kWh) : {result.energy_needed}
                </div>
                <div className="calculator_result_item">
                  user time (sec) : {result.user_time}
                </div>
                <div className="calculator_result_item">
                  cpu (core usage) : {result.cpu_core_use}
                </div>
                <div className="calculator_result_item">
                  memory (KB) : {result.memory_usage}
                </div>
              </div>
              <div className="calculator_first_item"></div>
            </div>
            <div className="calculator_result_second">
              <div className="calculator_result_second_item">
                <span className="static-text">Output of the process</span>
                <br></br>
                <br></br>
                {result.runtime_stdout}
              </div>
              <div className="calculator_result_second_item">
                <span className="static-text">Error of process</span>
                <br></br>
                <br></br>
                {result.runtime_stderr}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculator;
