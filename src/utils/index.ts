export const getTitle = (title: string) => {
  return title + ' - ' + import.meta.env.VITE_WEBSITE_NAME;
};
/**
 * Format number to VND.
 * Example: formatVND(10000);           // '10.000'
 */
export function formatVND(num: number | string) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function formatNumber(num: number) {
  if (num == 0) return 0;
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

export const getImageSize = (setImageDimensions: ({ width, height }: { width: number; height: number }) => void, imageUrl: string) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({ width: img.width, height: img.height });
    return { width: img.width, height: img.height };
  };
  img.onerror = (err) => {
    console.error(err);
  };
  return { width: img.width, height: img.height };
};

export function changeToSlug(title: string, separator: string = '-') {
  let slug;

  //Đổi chữ hoa thành chữ thường
  slug = title.toLowerCase().normalize('NFC');

  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, separator);
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, separator);
  slug = slug.replace(/\-\-\-\-/gi, separator);
  slug = slug.replace(/\-\-\-/gi, separator);
  slug = slug.replace(/\-\-/gi, separator);
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');

  return slug;
}

type GenericObject = { [key: string]: any };

export function sortByKeyAscending<T extends GenericObject, K extends keyof T>(array: T[], key: K): T[] {
  return array.slice().sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] > b[key]) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function sortByKeyDescending<T extends GenericObject, K extends keyof T>(array: T[], key: K): T[] {
  return array.slice().sort((a, b) => {
    if (a[key] > b[key]) {
      return -1;
    } else if (a[key] < b[key]) {
      return 1;
    } else {
      return 0;
    }
  });
}
