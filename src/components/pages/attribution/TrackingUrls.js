import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/planned-actual-tab.css';
import copy from 'copy-to-clipboard';
import buttonsStyle from 'styles/onboarding/buttons.css';
import trackingStyle from 'styles/campaigns/tracking.css';
import Textfield from 'components/controls/Textfield';
import Table from 'components/controls/Table';

export default class TrackingPlan extends Component {

  style = style;
  styles = [buttonsStyle, trackingStyle];

  static defaultProps = {
    campaigns: []
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: ''
    };
  }

  copy(value) {
    this.setState({copied: ''});
    copy(value);
    this.setState({copied: value});
  }

  render() {
    const {campaigns} = this.props;
    let rows = [];
    campaigns
      .filter(campaign => campaign.isArchived !== true)
      .forEach((campaign, campaignIndex) => {
        campaign.tracking && campaign.tracking.urls && campaign.tracking.urls.forEach((url, index) => {
          const utm = campaign.tracking.utms[index];
          rows.push(
            {
              items: [
                campaign.name,
                utm.source,
                utm.medium,
                <div style={{padding: '0 5px', marginBottom: '7px'}}>
                  <Textfield inputClassName={trackingStyle.locals.urlTextbox} style={{width: '250px'}} value={url.short}
                             readOnly={true} onFocus={(e) => e.target.select()}/>
                  <div className={trackingStyle.locals.copyToClipboard} onClick={this.copy.bind(this, url.short)}
                       style={{marginTop: '-26px', marginLeft: '221px'}}
                       data-checked={this.state.copied === url.short ? true : null}/>
                </div>,
                <div style={{padding: '0 5px', marginBottom: '7px'}}>
                  <Textfield inputClassName={trackingStyle.locals.urlTextbox} style={{width: '250px'}} value={url.long}
                             readOnly={true} onFocus={(e) => e.target.select()}/>
                  <div className={trackingStyle.locals.copyToClipboard} onClick={this.copy.bind(this, url.long)}
                       style={{marginTop: '-26px', marginLeft: '221px'}}
                       data-checked={this.state.copied === url.long ? true : null}/>
                </div>,
                new Date(url.createDate).toLocaleDateString()
              ]
            }
          );
        });
      });

    const headRow = [
      'Campaign Name',
      'Campaign Source',
      'Campaign Medium',
      'Shortened Tracking URL',
      'Full Tracking URL',
      'Create Date'
    ];

    return <div>
      <Table headRowData={{items: headRow}}
             rowsData={rows}/>
    </div>;
  }
}