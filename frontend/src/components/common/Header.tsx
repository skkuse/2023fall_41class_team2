// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT
import './Header.scss';
import Logo from '../../assets/LoGo.png';
import Divider from '@mui/material/Divider';

const Header = () => {
  return(
    <div className="header">
    <div className='header_logo'>
      <a href="/main">
       <img className='header_logo_img' src={Logo}/>
      </a>
    </div>
    <div className='header_links'>
      <a href="/"> 
        <div>Calculator</div>
      </a>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: "black" , borderRightWidth: 2}}/>
      <a href="https://github.com/skkuse/2023fall_41class_team2"> 
        <div>GitHub</div>
      </a>
    </div>
    </div>
  )
};

export default Header;
