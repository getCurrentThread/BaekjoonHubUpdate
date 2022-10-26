import { isNull, isEmpty, calculateBlobSHA } from '../common/utils/util';
import {
  getToken,
  getHook,
  getObjectDatafromPath,
  updateObjectDatafromPath,
  saveStats,
  updateLocalStorageStats,
} from '../common/store/storage';
import { GitHub } from '../common/api/github';
import {
  findUsername,
  findUniqueResultTableListByUsername,
  incMultiLoader,
  MultiloaderUpToDate,
  setMultiLoaderDenom,
} from './util';
import { findDatas } from './parsing';
import asyncPool from 'tiny-async-pool';

/* 모든 코드를 github에 업로드하는 함수 */

export async function uploadAllSolvedProblem() {
  const tree_items = [];

  // 업로드된 모든 파일에 대한 SHA 업데이트
  const stats = await updateLocalStorageStats();

  const hook = await getHook();
  const token = await getToken();
  const git = new GitHub(hook, token);

  const default_branch = stats.branches[hook];
  const { refSHA, ref } = await git.getReference(default_branch);

  const username = findUsername();
  if (isEmpty(username)) {
    if (debug) console.log('로그인되어 있지 않아. 파싱을 진행할 수 없습니다.');
    return;
  }
  const list = await findUniqueResultTableListByUsername(username);
  const { submission } = stats;
  const bojDatas = [];
  const datas = await findDatas(list);
  await Promise.all(
    datas.map(async (bojData) => {
      const sha = getObjectDatafromPath(
        submission,
        `${hook}/${bojData.directory}/${bojData.fileName}`,
      );
      if (debug)
        console.log('sha', sha, 'calcSHA:', calculateBlobSHA(bojData.code));
      if (isNull(sha) || sha !== calculateBlobSHA(bojData.code)) {
        bojDatas.push(bojData);
      }
    }),
  );

  if (bojDatas.length === 0) {
    MultiloaderUpToDate();
    if (debug) console.log('업로드 할 새로운 코드가 하나도 없습니다.');
    return null;
  }
  setMultiLoaderDenom(bojDatas.length);
  await asyncPool(2, bojDatas, async (bojData) => {
    if (!isEmpty(bojData.code) && !isEmpty(bojData.readme)) {
      const source = await git.createBlob(
        bojData.code,
        `${bojData.directory}/${bojData.fileName}`,
      ); // 소스코드 파일
      const readme = await git.createBlob(
        bojData.readme,
        `${bojData.directory}/README.md`,
      ); // readme 파일
      tree_items.push(...[source, readme]);
    }
    incMultiLoader(1);
  });

  try {
    if (tree_items.length !== 0) {
      const treeSHA = await git.createTree(refSHA, tree_items);
      const commitSHA = await git.createCommit(
        '전체 코드 업로드 -BaekjoonHub',
        treeSHA,
        refSHA,
      );
      await git.updateHead(ref, commitSHA);
      if (debug) console.log('전체 코드 업로드 완료');
      incMultiLoader(1);

      tree_items.forEach((item) => {
        updateObjectDatafromPath(submission, `${hook}/${item.path}`, item.sha);
      });
      await saveStats(stats);
    }
  } catch (error) {
    if (debug) console.log('전체 코드 업로드 실패', error);
  }
}
