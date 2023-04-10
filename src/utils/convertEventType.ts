export const handleType = (type: string) => {
  switch (type) {
    case 'tour':
      return 'Tour';
    case 'fg':
      return 'Frisbee Golf';
    case 'ol':
      return 'Ølympiske Lege';
    case 'gf':
      return 'Generalforsamling';
    default:
      return 'Andet arrangement';
  }
};
