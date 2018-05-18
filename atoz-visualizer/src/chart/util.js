import parseColor from 'parse-color';

export const KPM_RANGE_MIN = 3;
export const KPM_RANGE_MAX = 10;

export function setupData(data) {
  const defaultExt = {
    press: 0,
    prevDown: 0,
    prevUp: 0,
    delta: 0,
    speed: 0,
  };
  return data.map((d, i) => {
    const ext = {};
    ext.press = d.up - d.down;
    if (i > 0) {
      const prev = data[i - 1];
      ext.prevDown = prev.down;
      ext.prevUp = prev.up;
      ext.delta = d.down - prev.down;
      ext.speed = ext.delta > 0 ?
                  Math.round(60 * 1000 / ext.delta):
                  9999;
    }
    return {...d, ...defaultExt, ...ext};
  });
}

export function diffData(data, ref) {
  if (data.length !== ref.length ||
      data.some((d, i) => d.key !== ref[i].key)) {
    throw new Error('diffData: invalid reference data');
  }
  return data.map((d, i) => {
    const r = ref[i];
    const diffDown = r.down - d.down;
    const diffUp = r.up - d.up;
    const diffDelta = r.delta - d.delta;

    return {...d, diffDown, diffUp, diffDelta};
  });
}

export function kpmData(data) {
  return data.map((d, i) => {
    const ext = {};
    for (let range = KPM_RANGE_MIN; range <= KPM_RANGE_MAX && range <= i; ++range) {
      const ellapsed = data[i].down - data[i - range + 1].prevDown;

      // moving kpm
      ext['kpm' + range] = ellapsed > 0 ?
                           Math.round(60 * 1000 * range / ellapsed):
                           9999;
    }
    if (i > 0) {
      // total kpm
      ext.kpm = data[i].down > 0 ?
                Math.round(60 * 1000 * i / data[i].down):
                9999;
    }
    return {...d, ...ext};
  });
}

function average(array) {
  const sum = array.reduce((p, n) => p + n);
  return sum / array.length;
}

function standardScore(n, avg, sd) {
  if (sd !== 0)  {
    return 50 + 10 * (n - avg) / sd;
  } else {
    return 50;
  }
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

const twRankTimes = [
  {time: 0, rank: 'M3'},
  {time: 2, rank: 'M2'},
  {time: 4, rank: 'M1'},
  {time: 6, rank: 'ZZ'},
  {time: 8, rank: 'ZX'},
  {time: 10, rank: 'ZS'},
  {time: 12, rank: 'ZA'},
  {time: 14, rank: 'ZB'},
  {time: 16, rank: 'ZC'},
  {time: 18, rank: 'ZD'},
  {time: 20, rank: 'ZE'},
  {time: 22, rank: 'ZF'},
  {time: 24, rank: 'ZG'},
  {time: 26, rank: 'ZH'},
  {time: 28, rank: 'ZI'},
  {time: 30, rank: 'ZJ'},
  {time: 32, rank: 'XX'},
  {time: 34, rank: 'XS'},
  {time: 36, rank: 'XA'},
  {time: 38, rank: 'XB'},
  {time: 40, rank: 'XC'},
  {time: 42, rank: 'XD'},
  {time: 44, rank: 'XE'},
  {time: 46, rank: 'XF'},
  {time: 48, rank: 'XG'},
  {time: 50, rank: 'XH'},
  {time: 52, rank: 'XI'},
  {time: 54, rank: 'XJ'},
  {time: 56, rank: 'SS'},
  {time: 58, rank: 'SA'},
  {time: 60, rank: 'SB'},
  {time: 62, rank: 'SC'},
  {time: 64, rank: 'SD'},
  {time: 66, rank: 'SE'},
  {time: 68, rank: 'SF'},
  {time: 70, rank: 'SG'},
  {time: 72, rank: 'SH'},
  {time: 74, rank: 'SI'},
  {time: 76, rank: 'SJ'},
  {time: 80, rank: 'A'},
  {time: 86, rank: 'B'},
  {time: 94, rank: 'C'},
  {time: 104, rank: 'D'},
  {time: 116, rank: 'E'},
  {time: 130, rank: 'F'},
  {time: 146, rank: 'G'},
  {time: 164, rank: 'H'},
  {time: 184, rank: 'I'},
  {time: 206, rank: 'J'},
  {time: Infinity, rank: '-'},
];

export function calcTWRank(kpm) {
  if (kpm === 0) kpm = 1;
  const twLength = 400;
  const twTime = twLength / kpm * 60;
  for (let o of twRankTimes) {
    if (twTime < o.time) {
      return o.rank;
    }
  }
}
