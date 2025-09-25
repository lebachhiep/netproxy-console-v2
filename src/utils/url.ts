export const $url = (url?: string) => {
  if (!url) {
    return '';
  }
  if (url.includes('http')) {
    return url;
  }

  return import.meta.env.VITE_IMG_URL + url;
};
