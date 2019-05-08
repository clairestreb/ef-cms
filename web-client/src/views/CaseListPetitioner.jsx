import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPetitioner = connect(
  {
    caseList: state.formattedCases,
  },
  ({ caseList }) => {
    return (
      <>
        <div className="grid-container padding-x-0 subsection">
          <div className="grid-row">
            <div className="grid-col-6 hide-on-mobile">
              <h2>Your Cases</h2>
            </div>
            <div className="grid-col-6">
              <a
                className="usa-button new-case tablet-full-width"
                href="/before-starting-a-case"
                id="init-file-petition"
              >
                Start a New Case
              </a>
            </div>
          </div>
        </div>
        <div className="show-on-mobile">
          <h2>Your Cases</h2>
        </div>
        <table className="responsive-table dashboard" id="case-list">
          <thead>
            <tr>
              <th>Docket Number</th>
              <th>Date Filed</th>
              <th>Case Name</th>
            </tr>
          </thead>
          <tbody>
            {caseList.map(item => (
              <tr key={item.docketNumber}>
                <td className="hide-on-mobile">
                  <a href={'/case-detail/' + item.docketNumber}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>{item.createdAtFormatted}</td>
                <td>
                  <div className="show-on-mobile">
                    <a href={'/case-detail/' + item.docketNumber}>
                      {item.docketNumberWithSuffix}
                    </a>
                  </div>
                  {item.caseName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
);
