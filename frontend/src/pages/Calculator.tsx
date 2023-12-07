// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT
import CO2 from '@/assets/co2-gas-svgrepo-com.svg';
import Airplane from '@/assets/airplane-svgrepo-com.svg';
import Car from '@/assets/car-svgrepo-com.svg';
import Cpu from '@/assets/computer-cpu-svgrepo-com.svg';
import Energy from '@/assets/energy-forecast-lightning-svgrepo-com.svg';
import Memory from '@/assets/memory-chip-svgrepo-com.svg';
import Time from '@/assets/time-hourglass-svgrepo-com.svg';
import Tree from '@/assets/tree-decidious-svgrepo-com.svg';
import './Calculator.scss';
// import { useRecoilState } from 'recoil';
// import testState from '@/recoil/atoms/TestState';
import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { java } from '@codemirror/lang-java';
import { useRecoilState } from 'recoil';
import javaState from '@/recoil/atoms/JavaState';
import Header from '@/components/common/Header';
import Spinner from '@/assets/Spinner.svg';
import ResultContainer from '@/components/ResultContainer';
import Footer from '@/components/common/Footer';

import prettier from 'prettier/standalone';
import javaPlugin from 'prettier-plugin-java';

const getFormattedCode = async (code: string) => {
  const formattedCode: string = await prettier.format(code, {
    parser: 'java',
    plugins: [javaPlugin],
    tabWidth: 4,
  });
  console.log(`formattedCode: \n${formattedCode}`);
  return formattedCode;
};
const runJava = async (code: string) => {
  const formattedCode: string = await getFormattedCode(code);

  const { data } = await axios.post('/api/carbon_emission_calculate', {
    req_code: formattedCode,
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
  const handleFormatButtonClick = async () => {
    const formattedCode: string = await getFormattedCode(code);
    setCode(formattedCode);
  };

  useEffect(() => {
    document.body.classList.remove('scroll-disable');
  }, []);

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
            <div className="button_container">
              <button
                type="button"
                onClick={handleFormatButtonClick}
                className="calculator_format_button"
                disabled={isLoading} // 로딩 중일 때 버튼 비활성화
              >
                Format
              </button>
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
          </div>
          <div className="calculator_result">
            <div className="calculator_result_title">Result</div>
            <div className="calculator_result_first">
              <div className="calculator_first_item calculator_result_first_wrapper">
                <ResultContainer
                  imgFile={CO2}
                  calResult={parseFloat(result.carbon_emissions)}
                  unit={'g CO2e'}
                  description={'Carbon footprint'}
                />
                <ResultContainer
                  imgFile={Energy}
                  calResult={parseFloat(result.energy_needed)}
                  unit={'kWh'}
                  description={'Energy needed'}
                />
                <ResultContainer
                  imgFile={Car}
                  calResult={parseFloat(result.driving_length_eu)}
                  unit={'km'}
                  description={'in a passenger car'}
                />
                <ResultContainer
                  imgFile={Airplane}
                  calResult={parseFloat(result.flying_ratio)}
                  unit={'%'}
                  description={'of a flight ' + result.flying_path}
                />
                <ResultContainer
                  imgFile={Tree}
                  calResult={parseFloat(result.tree_month)}
                  unit={' tree-months'}
                  description={'Carbon sequestration'}
                />
                <ResultContainer
                  imgFile={Time}
                  calResult={parseFloat(result.user_time)}
                  unit={'sec'}
                  description={'user time'}
                />
                <ResultContainer
                  imgFile={Cpu}
                  calResult={parseFloat(result.cpu_core_use)}
                  unit={' cores'}
                  description={'cpu cores usage'}
                />
                <ResultContainer
                  imgFile={Memory}
                  calResult={parseFloat(result.memory_usage)}
                  unit={'KB'}
                  description={'memory'}
                />
              </div>
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
      <Footer type="calc" />
    </>
  );
}

export default Calculator;
