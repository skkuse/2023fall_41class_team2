// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import './ErrorPage.scss';

import { useRouteError } from 'react-router-dom';

// When page not found
const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Load Page Error!</h1>
      <p>Not found</p>
    </div>
  );
};

export default ErrorPage;
