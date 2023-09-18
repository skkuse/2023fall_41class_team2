// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// For entire layout
const Layout = () => {
  return (
    <div id="layout">
      <Header />
      <Outlet /> {/* Render child routes */}
      <Footer />
    </div>
  );
};

export default Layout;
