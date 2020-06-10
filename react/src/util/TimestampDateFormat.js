export default class TimestampDateFormat {
    constructor() {}
}

TimestampDateFormat.ToDate = (timestamp) => {
    const d = new Date(timestamp);
    let time = d.getTime();
    let hours = (''+d.getHours()).padStart(2, '0');
    let minutes = (''+d.getMinutes()).padStart(2, '0');
    let seconds = (''+d.getSeconds()).padStart(2, '0');
    let date = (''+d.getDate()).padStart(2, '0');
    let month = (''+d.getMonth()).padStart(2, '0');
    let year = (''+d.getFullYear()).slice(2);
    let fyear = (''+d.getFullYear());
    return {
        time, hours, minutes, seconds, date, month, year, fyear
    }
}

TimestampDateFormat.Job = (timestamp) => {
    const {date, month, year, hours, minutes} = TimestampDateFormat.ToDate(timestamp);
    return `${date}/${month}/${year} ${hours}:${minutes}`;
}

TimestampDateFormat.RoomOverview = (timestamp) => {
    const {date, month, year, hours, minutes} = TimestampDateFormat.ToDate(timestamp);
    return `${date}/${month} ${hours}:${minutes}`;
}