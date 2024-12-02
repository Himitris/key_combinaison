export const getMouseButtonName = (button: number): string => {
  const buttonMap: { [key: number]: string } = {
    0: 'MouseLeft',
    1: 'MouseMiddle',
    2: 'MouseRight',
  };
  
  return buttonMap[button] || `Mouse${button}`;
};