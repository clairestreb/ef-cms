import { JSDOM } from 'jsdom';
import { state } from 'cerebral';
import orderTemplate from '../../../views/CreateOrder/orderTemplate.html';

const replaceWithID = (replacements, domString) => {
  const { document } = new JSDOM(domString).window;

  Object.keys(replacements).forEach(id => {
    if (document.querySelector(id)) {
      document.querySelector(id).innerHTML = replacements[id];
    }
  });

  return document;
};

export const createOrderAction = ({ applicationContext, get }) => {
  let richText = get(state.form.richText) || '';
  let documentTitle = (get(state.form.documentTitle) || '').toUpperCase();
  richText = richText.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  const caseCaption = get(state.caseDetail.caseCaption) || '';
  const caseCaptionNames =
    applicationContext.getCaseCaptionNames(caseCaption) + ', ';
  const caseCaptionPostfix = caseCaption.replace(caseCaptionNames, '');
  const docketNumberWithSuffix = get(
    state.formattedCaseDetail.docketNumberWithSuffix,
  );

  const doc = replaceWithID(
    {
      '#caseCaptionNames': caseCaptionNames,
      '#caseCaptionPostfix': caseCaptionPostfix,
      '#docketNumber': docketNumberWithSuffix,
      '#orderBody': richText,
      '#orderTitleHeader': documentTitle,
    },
    orderTemplate,
  );

  const result = doc.children[0].innerHTML;

  return { htmlString: result };
};
