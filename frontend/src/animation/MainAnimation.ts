// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { useEffect, useRef, useState } from 'react';

export const useOutline = (
  element: React.MutableRefObject<null | HTMLElement>,
  interval: number,
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const angle = useRef(0);
  const [, setValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(angle.current);
      if (angle.current < 180) {
        angle.current += 1;
        const codeInput = element.current as HTMLDivElement;
        codeInput.style.setProperty(
          'background',
          `conic-gradient(from 270deg at 50% 100%, #38382D ${angle.current}deg, transparent 0deg 360deg)`,
        );
        setValue(angle.current);
      } else {
        setDisplay(true);
        clearInterval(id);
      }
    }, interval);

    return () => clearInterval(id);
  }, []);
};
