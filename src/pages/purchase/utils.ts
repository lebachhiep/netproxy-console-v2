export const getRadioOptionByDuration = (duration: number) => {
  const daysInSeconds = duration / 86400; // Convert seconds to days

  if (daysInSeconds >= 30) {
    return [1, 7, 30];
  } else if (daysInSeconds >= 7) {
    return [1, 7];
  } else {
    return [1];
  }
};
