export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function secConversion(sec) {
  let days = Math.floor(sec / 86400);
  sec -= days * 86400;
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  hrs = hrs.toString().padStart(2, '0')
  min = min.toString().padStart(2, '0')
  sec = sec.toString().padStart(2, '0')
  if (days > 0) {
    return `${days}days ${hrs}:${min}:${sec}`
  }
  if (hrs > 0) {
    return `${hrs}:${min}:${sec}`;
  }
  if (min > 0) {
    return `${min}:${sec}`;
  }
  return sec
}