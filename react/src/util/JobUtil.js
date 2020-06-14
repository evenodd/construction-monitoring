export default class JobUtil {
    constructor() {}
}

JobUtil.calculateCompletedJobs = (jobs) => {
    const completed = jobs.filter(job => job.completed);
    const pc = jobs.length && (completed.length / jobs.length) * 100;
    return pc.toFixed(2);
}