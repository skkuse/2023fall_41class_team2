// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT
import { Link } from 'react-router-dom';
import './Header.scss';
import Logo from '@/assets/LoGo.svg';

const Header = ({ type }: { type: string }) => {
  return (
    <div className={`header${type === 'calc' ? ' header_calc' : ''}`}>
      <Link to="/">
        <img className="header_logo" src={Logo} alt="text" />
      </Link>
      <div className="header_nav">
        <Link to="/calculate" className="header_nav_item">
          Calculator
        </Link>
        <div
          className="header_nav_item"
          onClick={() =>
            window.open(
              'https://github.com/skkuse/2023fall_41class_team2',
              '_blank',
            )
          }
        >
          Github
        </div>
      </div>
    </div>
  );
};

export default Header;
