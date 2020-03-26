import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

describe('gotoPrintablePendingReportSequence', () => {
  let test;
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      revokeObjectURL: () => {},
    };
    test = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    await test.runSequence('gotoPrintablePendingReportSequence', {});
    expect(test.getState('currentPage')).toBe('SimplePdfPreviewPage');
    expect(test.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(test.getState('screenMetadata.headerTitle')).toBe('Pending Report');
  });
});
