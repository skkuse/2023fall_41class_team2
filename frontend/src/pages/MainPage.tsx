import './MainPage.scss';
import Banner from '../assets/banner-image.svg';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import { useEffect, useRef, useState } from 'react';
import { bannerVariants, useOutline } from '@/animation/MainAnimation';
import MAIN_CODE from '@/constants/MainCode';
import { motion } from 'framer-motion';

const MainPage = () => {
  const [code, setCode] = useState('');
  const position = useRef(0);
  const [display, setDisplay] = useState(false);
  const [typing, setTyping] = useState(false);
  const codeInput = useRef(null);

  useOutline(codeInput, 8, setDisplay, setTyping);

  useEffect(() => {
    if (!typing) {
      return;
    }
    const interval = setInterval(() => {
      if (position.current < MAIN_CODE.length - 1) {
        setCode((prev) => prev + MAIN_CODE[position.current]);
        position.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 10);
  }, [typing]);

  return (
    <>
      <Header type="main" />
      <div className="main">
        <div className="main_container">
          <div className="main_banner">
            <motion.div
              className="main_banner_text"
              variants={bannerVariants}
              initial="hidden"
              animate="display"
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <div className="main_banner_title">
                <span className="main_banner_title_1">E</span>
                <span className="main_banner_title_2">code</span>
              </div>
              <div className="main_banner_description">
                <span>
                  Input your code
                  <br />
                  Calculate carbon footprint
                </span>
              </div>
              <Link className="main_banner_button" to="/calculate">
                Get started ➝
              </Link>
            </motion.div>
            <motion.img
              src={Banner}
              className="main_banner_img"
              variants={bannerVariants}
              initial="hidden"
              animate="display"
              transition={{ duration: 0.7, delay: 0 }}
            />
          </div>
          <div className="main_context">
            <div className="main_context_text">
              <span>253.64g CO2e</span>
            </div>
            {/* <img className="main_context_img" src={CodeInput} /> */}
            <div className="main_code_input" ref={codeInput}>
              <span
                className={`main_code_input_hide${display ? ' fade-in' : ''}`}
              />
              <div
                className={`main_editor_header${display ? ' header-show' : ''}`}
              >
                <div className="editor_circle">
                  <div className="editor_circle_item red" />
                  <div className="editor_circle_item yellow" />
                  <div className="editor_circle_item green" />
                </div>
              </div>
              <div className={`main_editor${display ? ' editor-show' : ''}`}>
                <pre className="main_editor_inner">{code}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
