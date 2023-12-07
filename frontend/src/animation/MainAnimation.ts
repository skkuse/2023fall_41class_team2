// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

import { useEffect, useRef, useState } from 'react';

// variants

export const bannerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  display: {
    opacity: 1,
    y: 0,
  },
};

// animation hooks

export const useOutline = (
  element: React.MutableRefObject<null | HTMLElement>,
  interval: number,
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>,
  setTyping: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const angle = useRef(0);
  const [, setValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function animation() {
      const id = setInterval(() => {
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
          setTyping(true);
          clearInterval(id);
        }
      }, interval);

      return id;
    }

    setTimeout(() => {
      const id = animation();
      intervalRef.current = id;
    }, 1500);

    return () => clearInterval(intervalRef.current);
  }, []);
};
