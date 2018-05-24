import { browser, by, element } from 'protractor';

export class CustodianClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cus-root h1')).getText();
  }
}
