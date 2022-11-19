const YearCounter = async (input, begin, tail, property) => {
  const BaseYear = begin.split('-')[0];
  const LastYear = tail.split('-')[0];
  const arr = [];
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

    arr.push({
      year: i,
      count: count,
    });
  }
  return arr;
};
const MonthCounter = async (input, begin, tail, property) => {
  const BaseYear = begin.split('-')[0];
  const BaseMonth = begin.split('-')[1];
  const LastYear = tail.split('-')[0];
  const LastMonth = tail.split('-')[1];
  const arr = [];
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
        console.log(BaseYear, BaseMonth, LastYear, LastMonth, item.updated_at);
        if (
          item[property] &&
          Date.parse(curMonth) <= Date.parse(item[property]) &&
          Date.parse(nextMonth) >= Date.parse(item[property])
        ) {
          count++;
        }
      });
      arr.push({
        year: i,
        month: j,
        count: count,
      });
      console.log(arr);
    }
  }
  return arr;
};
const DayCounter = async (input, begin, tail, property) => {
  const BaseYear = begin.split('-')[0];
  const BaseMonth = begin.split('-')[1];
  const BaseDay = begin.split('-')[2];
  const LastYear = tail.split('-')[0];
  const LastMonth = tail.split('-')[1];
  const LastDay = tail.split('-')[2];
  const arr = [];
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
        arr.push({
          year: i,
          month: j,
          day: p,
          count: count,
        });
      }
    }
  }
  return arr;
};
module.exports = {YearCounter, MonthCounter, DayCounter};
