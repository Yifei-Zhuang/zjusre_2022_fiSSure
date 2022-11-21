const YearCounter = async (input, property, begin, tail) => {
  try {
    const BaseYear = begin ? begin : '2008';
    const LastYear = tail ? tail : new Date().getUTCFullYear();
    let arr = {};
    for (let i = parseInt(BaseYear); i <= parseInt(LastYear); i++) {
      const curYear = `${i}-01-01T00:00:00.00Z`;
      const nextYear = `${i + 1}-01-01T00:00:00.00Z`;
      let count = 0;
      input.forEach(item => {
        if (
          item[property] &&
          Date.parse(curYear) <= Date.parse(item[property]) &&
          Date.parse(nextYear) >= Date.parse(item[property])
        ) {
          count++;
        }
      });
      arr[`${i}-01-01`] = count;
    }
    return arr;
  } catch (e) {
    throw e;
  }
};
const MonthCounter = async (input, property, begin, tail) => {
  try {
    const BaseYear = begin ? begin.split('-')[0] : '2008';
    const BaseMonth = begin ? begin.split('-')[1] : '3';
    const LastYear = tail ? tail.split('-')[0] : new Date().getUTCFullYear();
    const LastMonth = tail
      ? tail.split('-')[1]
      : new Date().toISOString().split('-')[1];

    let arr = {};
    for (let i = parseInt(BaseYear); i <= parseInt(LastYear); i++) {
      for (
        let j = i == BaseYear ? parseInt(BaseMonth) : 1;
        j <= (i == LastYear ? parseInt(LastMonth) : 12);
        j++
      ) {
        if (j == 13) {
          break;
        }
        const curMonth =
          j < 10 ? `${i}-0${j}-01T00:00:00.00Z` : `${i}-${j}-01T00:00:00.00Z`;
        const nextMonth =
          j != 12
            ? j >= 9
              ? `${i}-${j + 1}-01T00:00:00.00Z`
              : `${i}-0${j + 1}-01T00:00:00.00Z`
            : `${i + 1}-${'01'}-01T00:00:00.00Z`;
        let count = 0;
        input.forEach(item => {
          if (
            item[property] &&
            Date.parse(curMonth) <= Date.parse(item[property]) &&
            Date.parse(nextMonth) >= Date.parse(item[property])
          ) {
            count++;
          }
        });
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
          const curDay =
            p < 10
              ? j < 10
                ? `${i}-0${j}-0${p}T00:00:00.00Z`
                : `${i}-${j}-${p}T00:00:00.00Z`
              : j < 10
              ? `${i}-0${j}-${p}T00:00:00.00Z`
              : `${i}-${j}-${p}T00:00:00.00Z`;
          const nextDay =
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
          input.forEach(item => {
            if (
              item[property] &&
              Date.parse(curDay) <= Date.parse(item[property]) &&
              Date.parse(nextDay) >= Date.parse(item[property])
            ) {
              count++;
            }
          });
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
module.exports = {YearCounter, MonthCounter, DayCounter};
