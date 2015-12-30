import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';

/**
 * @typedef {Object} CaptureInfo -  Capture test data
 * @property item - initial data to capture
 * @property request
 * @property request.endpoint
 * @property request.action
 * @property request.query
 * @property request.body
 * @property capture.data - accept only 'response' and 'error'
 * @property capture.field
 * @property capture.ignoreProps
 * @property capture.outputPath - use this to capture & test expectedData
 * @property expectResponse.status
 * @property expectResponse.body
 */

/**
 *
 * @param supertestRequest - supertest request
 * @param {CaptureInfo} captureInfo
 */
export default function captureData(supertestRequest, captureInfo) {
  return new Promise(resolve => {

    let request = supertestRequest[captureInfo.request.action](captureInfo.request.endpoint);

    if (captureInfo.request.query) {
      request = request.query(captureInfo.request.query);
    }

    if (captureInfo.request.body) {
      request = request.send(captureInfo.request.body);
    }

    request.end((error, response) => {
      const parentFolder = path.resolve(captureInfo.capture.outputPath, '../');
      switch (captureInfo.capture.data) {
        case 'response':
          mkdirp(parentFolder, () => fs.writeFile(captureInfo.capture.outputPath, JSON.stringify(response.body, null, 2), resolve));
          break;
        case 'error':
          mkdirp(parentFolder, () => fs.writeFile(captureInfo.capture.outputPath, JSON.stringify(error.body, null, 2), resolve));
          break;
        default:
          break;
      }
    });
  });
}

/**
 * @param supertestRequest - supertest request
 * @param {CaptureInfo[]} captureInfos
 */
export function captureAllData(supertestRequest, captureInfos) {
  for (const item of captureInfos) {
    captureData(supertestRequest, item);
  }
}
