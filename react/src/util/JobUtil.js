export default class JobUtil {
    constructor() {}
}

JobUtil.calculateCompletedJobs = (jobs) => {
    const completed = jobs.filter(job => job.completed);
    const pc = jobs.length && (completed.length / jobs.length);
    return pc.toFixed(2);
}