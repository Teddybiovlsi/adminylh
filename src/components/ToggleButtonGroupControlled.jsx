import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function ToggleButtonGroupControlled() {
  const [value, setValue] = useState([1, 3]);

  /*
   * The second argument that will be passed to
   * `handleChange` from `ToggleButtonGroup`
   * is the SyntheticEvent object, but we are
   * not using it in this example so we will omit it.
   */
  const handleChange = (val) => setValue(val);

  return (
    <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
      <ToggleButton id="tbg-btn-1" value={1}>
        Option 1
      </ToggleButton>
      <ToggleButton id="tbg-btn-2" value={2}>
        Option 2
      </ToggleButton>
      <ToggleButton id="tbg-btn-3" value={3}>
        Option 3
      </ToggleButton>
      <ToggleButton id="tbg-btn-4" value={4}>
        Option 4
      </ToggleButton>
      <ToggleButton id="tbg-btn-5" value={5}>
        Option 5
      </ToggleButton>
      <ToggleButton id="tbg-btn-6" value={6}>
        Option 6
      </ToggleButton>
      <ToggleButton id="tbg-btn-7" value={7}>
        Option 7
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

render(<ToggleButtonGroupControlled />);
