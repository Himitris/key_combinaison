export const normalizeKey = (key: string): string => {
  const keyMap: { [key: string]: string } = {
    ' ': 'Space',
    'Control': 'Ctrl',
    'MouseLeft': 'Left Click',
    'MouseMiddle': 'Middle Click',
    'MouseRight': 'Right Click',
  };

  return (keyMap[key] || key).toLowerCase();
};

export const formatKeyDisplay = (key: string): string => {
  return key.charAt(0).toUpperCase() + key.slice(1);
};