import parseColor from 'parse-color';

export function setupData(data) {
  const defaultExt = {
    press: 0,
    prevDown: 0,
    prevUp: 0,
    delta: 0,
    kpm: 0,
  };
  return data.map((d, i) => {
    const ext = {};
    ext.press = d.up - d.down;
    if (i > 0) {
      ext.prevDown = data[i - 1].down;
      ext.prevUp = data[i - 1].up;
      ext.delta = d.down - ext.prevDown;
      ext.kpm = 60 * 1000 / ext.delta;
    }
    return {...d, ...defaultExt, ...ext};
  });
}

export function average(array) {
  const sum = array.reduce((p, n) => p + n);
  return sum / array.length;
}

export function standardScore(n, avg, sd) {
  return 50 + 10 * (n - avg) / sd;
}

export function statsData(data) {
  if (!data || !data.length) return [];
  const keys = Object.keys(data[0]);
  const statKeys = keys.filter(k => typeof data[0][k] === 'number');
  const stats = {};
  const cache = {};

  for (let k of statKeys) {
      // TODO: A の無意味なデータを除外したい
      cache[k] = data.map(d => d[k])
                     .sort(((a, b) => Number(a) - Number(b)));
      const avg = average(cache[k]);
      const medianPos = (cache[k].length - 1) / 2;

      stats[k] = {
        average: avg,
        median: average(cache[k].slice(Math.floor(medianPos), Math.ceil(medianPos) + 1)),
        variance: average(cache[k].map(n => n * n)) - avg * avg,
      };
      stats[k].sd = Math.sqrt(stats[k].variance);
  }

  return data.map(d => {
    const ext = {
      score: {},
      rank: {},
      percentile: {}
    };
    const fix = (n) => Number(n.toFixed(3));

    for (let k of statKeys) {
      ext.score[k] = fix(standardScore(d[k], stats[k].average, stats[k].sd));
      ext.rank[k] = cache[k].findIndex(e => e === d[k]);
      ext.percentile[k] = fix(data.length > 1 ?
                              100 * ext.rank[k] / (data.length - 1):
                              0);
    }

    return {...d, ...ext};
  });
}

export function mapColor({colors, min, max}, value) {
  const rgbaColors = colors.map(c => parseColor(c).rgba);

  let p;
  if (min < value && value < max) {
    p = (value - min) / (max - min);
  } else if (value <= min) {
    p = 0;
  } else if (value >= max) {
    p = 0.999;
  }

  // p = 0, range = 0.5 => [0, 1], 0
  // p = 0.2, range = 0.5 => [0, 1], 0.4
  // p = 0.5 range = 0.5 => [1, 2], 0
  // p = 0.9 range = 0.5 => [1, 2], 0.8
  // p = 1.0 range = 0.5 => [2, 3], 0
  const colorRange = 1 / (rgbaColors.length - 1);
  const colorIndex = Math.floor(p / colorRange);
  const colorFrom = rgbaColors[colorIndex];
  const colorTo = rgbaColors[colorIndex + 1];
  const colorP = (p - colorIndex * colorRange) * (rgbaColors.length - 1);
  const color = colorFrom.map((c, i) => c * (1 - colorP) + colorTo[i] * colorP);

  return `rgba(${color.join(',')})`;
}
