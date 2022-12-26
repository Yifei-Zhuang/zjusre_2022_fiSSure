const { prependOnceListener } = require('../models/issue');

const YearCounter = async (input, property, begin, tail, map) => {
  try {
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const LastYear = tail ? tail.split('-')[0] : new Date().getUTCFullYear();
    let arr = {};
    let pre = 0;
    for (
      let i = parseInt(BaseYear);
      i <= parseInt(LastYear) && pre < input.length;
      i++
    ) {
      let _curYear = `${i}-01-01T00:00:00.00Z`;
      let _nextYear = `${i + 1}-01-01T00:00:00.00Z`;
      if (map && map.has(_curYear.substring(0, 10))) {
        continue;
      }
      let curYear = Date.parse(_curYear);
      let nextYear = Date.parse(_nextYear);
      let count = 0;
      for (let j = pre; j < input.length; j++) {
        const item = input[j];
        if (
          item[property] &&
          curYear <= Date.parse(input[j][property]) &&
          nextYear >= Date.parse(input[j][property])
        ) {
          count++;
          pre++;
        } else if (nextYear < Date.parse(input[j][property])) {
          pre = j;
          break;
        }
      }
      arr[`${i}-01-01`] = count;
    }
    return arr;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const MonthCounter = async (input, property, begin, tail, map) => {
  try {
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = tail ? tail.split('-')[0] : new Date().getUTCFullYear();
    const LastMonth = tail
      ? tail.split('-')[1]
      : new Date().toISOString().split('-')[1];

    let arr = {};
    let pre = 0;
    for (
      let i = parseInt(BaseYear);
      i <= parseInt(LastYear) && pre < input.length;
      i++
    ) {
      for (
        let j = i == BaseYear ? parseInt(BaseMonth) : 1;
        j <= (i == LastYear ? parseInt(LastMonth) : 12);
        j++
      ) {
        if (j == 13) {
          break;
        }
        let _curMonth =
          j < 10 ? `${i}-0${j}-01T00:00:00.00Z` : `${i}-${j}-01T00:00:00.00Z`;
        let _nextMonth =
          j != 12
            ? j >= 9
              ? `${i}-${j + 1}-01T00:00:00.00Z`
              : `${i}-0${j + 1}-01T00:00:00.00Z`
            : `${i + 1}-${'01'}-01T00:00:00.00Z`;
        if (map && map.has(_curMonth.substring(0, 10))) {
          continue;
        }
        let curMonth = Date.parse(_curMonth);
        let nextMonth = Date.parse(_nextMonth);

        let count = 0;
        for (let x = pre; x < input.length; x++) {
          const item = input[x];
          if (
            item[property] &&
            curMonth <= Date.parse(item[property]) &&
            nextMonth >= Date.parse(item[property])
          ) {
            count++;
            pre++;
          } else if (nextMonth < Date.parse(item[property])) {
            pre = x;
            break;
          }
        }

        let key;
        if (j < 10) {
          key = `${i}-0${j}-01`;
        } else {
          key = `${i}-${j}-01`;
        }
        arr[key] = count;
      }
    }
    return arr;
  } catch (e) {
    throw e;
  }
};
const DayCounter = async (input, property, begin, tail) => {
  try {
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const BaseDay = begin ? begin.split('-')[2] : '31';
    const LastYear = tail ? tail.split('-')[0] : new Date().getUTCFullYear();
    const LastMonth = tail
      ? tail.split('-')[1]
      : new Date().toISOString().split('-')[1];
    const LastDay = tail
      ? tail.split('-')[2]
      : new Date().toISOString().split('-')[2];

    let arr = {};
    //! 不考虑闰年
    const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let pre = 0;
    for (let i = parseInt(BaseYear); i <= parseInt(LastYear); i++) {
      for (
        let j = i == parseInt(BaseYear) ? parseInt(BaseMonth) : 1;
        j <= (i == parseInt(LastYear) ? parseInt(LastMonth) : 12);
        j++
      ) {
        if (j == 13) {
          break;
        }
        for (
          let p =
            i == parseInt(BaseYear) && j == parseInt(BaseMonth)
              ? parseInt(BaseDay)
              : 1;
          p <=
          (i == parseInt(LastYear) && j == parseInt(LastMonth)
            ? parseInt(LastDay)
            : daysOfMonth[j - 1]);
          p++
        ) {
          if (p > daysOfMonth[j - 1]) {
            break;
          }
          let curDay =
            p < 10
              ? j < 10
                ? `${i}-0${j}-0${p}T00:00:00.00Z`
                : `${i}-${j}-${p}T00:00:00.00Z`
              : j < 10
                ? `${i}-0${j}-${p}T00:00:00.00Z`
                : `${i}-${j}-${p}T00:00:00.00Z`;
          let nextDay =
            p == daysOfMonth[j - 1]
              ? j == 12
                ? `${i + 1}-01-01T00:00:00.00Z`
                : j >= 9
                  ? `${i}-${j + 1}-01T00:00:00.00Z`
                  : `${i}-0${j + 1}-01T00:00:00.00Z`
              : p >= 9
                ? j < 10
                  ? `${i}-0${j}-${p + 1}T00:00:00.00Z`
                  : `${i}-${j}-${p + 1}T00:00:00.00Z`
                : j < 10
                  ? `${i}-0${j}-0${p + 1}T00:00:00.00Z`
                  : `${i}-${j}-0${p + 1}T00:00:00.00Z`;
          let count = 0;
          for (let x = pre; x < input.length; x++) {
            const item = input[x];
            curDay = Date.parse(curDay);
            nextDay = Date.parse(nextDay);

            if (
              item[property] &&
              curDay <= Date.parse(item[property]) &&
              nextDay >= Date.parse(item[property])
            ) {
              count++;
              x++;
            } else if (nextDay >= Date.parse(item[property])) {
              pre = x;
              break;
            }
          }
          let key = undefined;
          if (j < 10) {
            if (p < 10) {
              key = `${i}-0${j}-0${p}`;
            } else {
              key = `${i}-0${j}-${p}`;
            }
          } else {
            if (p < 10) {
              key = `${i}-${j}-0${p}`;
            } else {
              key = `${i}-${j}-${p}`;
            }
          }
          arr[key] = count;
        }
      }
    }
    return arr;
  } catch (e) {
    throw e;
  }
};
async function Sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}
const AsyncFunctionWrapper = async (fn, ...props) => {
  // let arr = new Array(10).map(item =>{
  //   return fn(...props)
  // })
  // await Promise.all(...arr)
  await Promise.all([
    fn(...props),
    fn(...props),
    fn(...props),
    fn(...props),
    fn(...props),
    fn(...props),
    fn(...props),
    fn(...props),
    // fn(...props),
    // fn(...props),
    // fn(...props),
  ]);
};
module.exports = {
  YearCounter,
  MonthCounter,
  DayCounter,
  AsyncFunctionWrapper,
  Sleep,
};
