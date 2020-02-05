export function formatDate(date, short) {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    let result;
    if (short) {
      let yearShort = year[2] + year[3];
      result = `${day}-${month}-${yearShort}`;
    } else {
      result = `${day}-${month}-${year}`;
    }
    return result;
}