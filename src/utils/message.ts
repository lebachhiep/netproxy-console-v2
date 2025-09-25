export const getMessage = (field: string, type: string) => {
  switch (type) {
    case 'string':
      return `Vui lòng nhập ${field.toLowerCase()}`;
    case 'email':
      return 'Email không hợp lệ';
    case 'number':
      return 'Số không hợp lệ';
    case 'array':
      return `Vui lòng chọn ${field.toLowerCase()}`;
    default:
      return '';
  }
};
