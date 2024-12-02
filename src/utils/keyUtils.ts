export const normalizeKey = (key: string): string => {
  const keyMap: { [key: string]: string } = {
    ' ': 'Space',
    'Control': 'Ctrl',
    'MouseLeft': 'Left Click',
    'MouseMiddle': 'Middle Click',
    'MouseRight': 'Right Click',
  };

  // First check if we have a direct mapping
  if (keyMap[key]) {
    return keyMap[key].toLowerCase();
  }

  // Handle single character keys
  if (key.length === 1) {
    return key.toLowerCase();
  }

  // Return the key as is for other cases
  return key.toLowerCase();
};

export const formatKeyDisplay = (key: string): string => {
  // Special case for mouse clicks which are already properly formatted
  if (key.includes('click')) {
    return key.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  return key.charAt(0).toUpperCase() + key.slice(1);
};