// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { atom } from 'recoil';
import { TestState } from './StateTypes';

const count = atom({
  key: 'count',
  default: 0,
});

const testState: TestState = {
  count,
};

export default testState;
