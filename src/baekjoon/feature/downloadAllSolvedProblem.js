import { isNull } from '../common/utils/util';
import {
  findUsername,
  findUniqueResultTableListByUsername,
  incMultiLoader,
  setMultiLoaderDenom,
} from './util';
import { findDatas } from './parsing';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/* 모든 코드를 zip 파일로 저장하는 함수 */

export async function downloadAllSolvedProblem() {
  const zip = new JSZip();
  await findUniqueResultTableListByUsername(findUsername())
    .then((list) => {
      setMultiLoaderDenom(list.length);
      return findDatas(list).then((datas) => {
        return Promise.all(
          datas.map(async (bojData) => {
            if (isNull(bojData)) return;
            const folder = zip.folder(bojData.directory);
            folder.file(`${bojData.fileName}`, bojData.code);
            folder.file('README.md', bojData.readme);
            incMultiLoader(1);
          }),
        );
      });
    })
    // eslint-disable-next-line no-unused-vars
    .then((_) =>
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'all_solved_problem.zip');
      }),
    )
    // eslint-disable-next-line no-unused-vars
    .then((_) => {
      if (debug) console.log('전체 코드 다운로드 완료');
      incMultiLoader(1);
    })
    .catch((e) => {
      if (debug) console.log('전체 코드 다운로드 실패', e);
    });
}
