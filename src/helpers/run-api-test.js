import omitNested from './omit-nested';

/**
 *
 * @param supertestRequest - supertest request
 * @param {CaptureInfo} captureInfo
 * @param expect - chai expect
 */
export default function runApiTest(supertestRequest, captureInfo, expect) {
  return done => {
    let request = supertestRequest[captureInfo.request.action](captureInfo.request.endpoint);

    if (captureInfo.request.query) {
      request = request.query(captureInfo.request.query);
    }

    if (captureInfo.request.body) {
      request = request.send(captureInfo.request.body);
    }

    request.end((error, response) => {
      if (error) {
        done(error);
      }

      const expectedBody = omitNested(require(captureInfo.expectResponse.bodyPath), ['_id', 'createdTime', 'modifiedTime']);
      expect(response.status).to.equal(captureInfo.expectResponse.status);
      expect(response.body).to.containSubset(expectedBody);
      done();
    });
  };
}
