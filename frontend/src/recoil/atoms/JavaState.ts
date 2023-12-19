// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { atom } from 'recoil';
import { JavaState } from './StateTypes';

const result = atom({
  key: 'result',
  default: {},
});

const javaState: JavaState = {
  result,
};

export default javaState;
