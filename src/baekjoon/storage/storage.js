import { TTLCacheStats } from '../../common/store/TTLCache';

export default class Stats {
  problemCache = new TTLCacheStats('problem');
  submitCodeCache = new TTLCacheStats('scode');
  SolvedACCache = new TTLCacheStats('solvedac');
  async updateProblems(problem) {
    const data = {
      id: problem.problemId,
      problem_description: problem.problem_description,
      problem_input: problem.problem_input,
      problem_output: problem.problem_output,
    };
    await this.problemCache.update(data);
  }

  async getProblem(problemId) {
    return this.problemCache.get(problemId);
  }

  async updateSubmitCode(obj) {
    const data = {
      id: obj.submissionId,
      data: obj.code,
    };
    await this.submitCodeCache.update(data);
  }

  async getSubmitCode(submissionId) {
    return this.submitCodeCache.get(submissionId).then((x) => x?.data);
  }

  async updateSolvedAC(obj) {
    const data = {
      id: obj.problemId,
      data: obj.jsonData,
    };
    await this.SolvedACCache.update(data);
  }

  async getSolvedAC(problemId) {
    return this.SolvedACCache.get(problemId).then((x) => x?.data);
  }
}
