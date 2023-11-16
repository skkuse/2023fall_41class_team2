// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT
import './Header.scss';
import Logo from '@/assets/LoGo.svg';

const Header = () => {
  return (
    <div className="header">
      <img className="header_logo" src={Logo} alt="text" />
      <div className="header_nav">
        <div className="header_nav_item">Calculator</div>
        <div className="header_nav_item">Github</div>
      </div>
    </div>
  );
};

export default Header;
