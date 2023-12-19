// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { Outlet } from 'react-router-dom';

// For entire layout
const Layout = () => {
  return (
    <div id="layout">
      <Outlet /> {/* Render child routes */}
    </div>
  );
};

export default Layout;
