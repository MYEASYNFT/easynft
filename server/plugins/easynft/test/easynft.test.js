'use strict';

const mock = require('egg-mock');

describe('test/easynft.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/easynft-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, easynft')
      .expect(200);
  });
});
