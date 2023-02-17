import React, { useState } from "react";

export default function useBoolean(initState = false) {
  const [showHidestate, setShowHidestate] = useState(initState);

  const handleToggle = () => {
    setShowHidestate(!showHidestate);
  };

  return [
    showHidestate,
    {
      setShowPwd: handleToggle,
    },
  ];
}
