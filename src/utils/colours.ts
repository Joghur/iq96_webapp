export const randomColor = () => {
  return '#' + Math.random().toString(16).substr(-6);
};

export const colors = {
  dark: '#333333',
  light: '#F5FCFF',
  button: '#f50',
  event: 'red',
  success: 'green',
  lightSuccess: 'darkseagreen',
  error: 'red',
  lightError: 'crimson',
  white: 'white',
};
