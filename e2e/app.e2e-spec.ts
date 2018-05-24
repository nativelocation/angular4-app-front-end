import { CustodianClientPage } from './app.po';

describe('custodian-client App', () => {
  let page: CustodianClientPage;

  beforeEach(() => {
    page = new CustodianClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to cus!');
  });
});
