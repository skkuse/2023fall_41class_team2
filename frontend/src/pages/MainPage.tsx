import './MainPage.scss';
import Banner from '../assets/banner-image.svg';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import { useEffect, useRef, useState } from 'react';
import { showVariants, useOutline } from '@/animation/MainAnimation';
import MAIN_CODE from '@/constants/MainCode';
import { motion } from 'framer-motion';
import AnimatedNumbers from 'react-animated-numbers';
import Footer from '@/components/common/Footer';

const MainPage = () => {
  const [code, setCode] = useState('');
  const [display, setDisplay] = useState(false);
  const [typing, setTyping] = useState(false);
  const typeFin = useRef(false);
  const [co2, setCo2] = useState(0);

  const position = useRef(0);
  const codeInput = useRef(null);

  useOutline(codeInput, 8, setDisplay, setTyping);

  useEffect(() => {
    document.body.classList.add('scroll-disable');
  }, []);

  useEffect(() => {
    if (!typing) {
      return;
    }

    document.body.classList.remove('scroll-disable');
    const typeInterval = setInterval(() => {
      if (position.current < MAIN_CODE.length - 1) {
        setCode((prev) => prev + MAIN_CODE[position.current]);
        position.current += 1;
      } else {
        clearInterval(typeInterval);
        typeFin.current = true;
      }
    }, 7);

    const co2Interval = setInterval(() => {
      if (!typeFin.current) {
        setCo2((prev) => prev + 256.43);
      } else {
        clearInterval(co2Interval);
      }
    }, 1000);
  }, [typing]);

  return (
    <>
      <Header type="main" />
      <div className="main">
        <div className="main_section1">
          <div className="main_section1_container">
            <div className="main_banner">
              <motion.div
                className="main_banner_text"
                variants={showVariants}
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
                variants={showVariants}
                initial="hidden"
                animate="display"
                transition={{ duration: 0.7, delay: 0 }}
              />
            </div>
            <div className="main_context">
              <div className={`main_context_text${display ? '' : ' hide'}`}>
                <AnimatedNumbers
                  includeComma
                  animateToNumber={co2}
                ></AnimatedNumbers>
                <div>g CO2E</div>
                {/* <span>253.64g CO2e</span> */}
              </div>
              {/* <img className="main_context_img" src={CodeInput} /> */}
              <div className="main_code_input" ref={codeInput}>
                <span
                  className={`main_code_input_hide${display ? ' fade-in' : ''}`}
                />
                <div
                  className={`main_editor_header${
                    display ? ' header-show' : ''
                  }`}
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
        <div className="main_section2">
          <div className="main_section2_container">
            <motion.div
              initial="hidden"
              variants={showVariants}
              whileInView="display"
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h1>Green Calculate formula</h1>
              <hr
                style={{
                  backgroundColor: 'black',
                  height: '1px',
                  width: 'calc(100vw - 500px)',
                  marginBottom: '60px',
                }}
              />
            </motion.div>
            <motion.p
              initial="hidden"
              variants={showVariants}
              whileInView="display"
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1 }}
            >
              The carbon footprint is calculated by estimating the energy draw
              of the algorithm and the carbon intensity of producing this energy
              at a given location:
              <br /> <br />
              <span style={{ fontWeight: 500 }}>
                carbon footprint = energy needed * carbon intensity
              </span>
              <br /> <br />
              Where the energy needed is:
              <br /> <br />
              <span style={{ fontWeight: 500 }}>
                runtime * (power draw for cores * usage + power draw for memory)
                * PUE * PSF
              </span>
              <br /> <br />
              The power draw for the computing cores depends on the model and
              number of cores, while the memory power draw only depends on the
              size of memory available. The usage factor corrects for the real
              core usage (default is 1, i.e. full usage). The PUE (Power Usage
              Effectiveness) measures how much extra energy is needed to operate
              the data centre (cooling, lighting etc.). The PSF (Pragmatic
              Scaling Factor) is used to take into account multiple identical
              runs (e.g. for testing or optimisation).
              <br /> <br />
              The Carbon Intensity depends on the location and the technologies
              used to produce electricity. But note that the "energy needed"
              indicated at the top of this page is independent of the location.
            </motion.p>
          </div>
        </div>
      </div>
      <Footer type="calc" />
    </>
  );
};

export default MainPage;
