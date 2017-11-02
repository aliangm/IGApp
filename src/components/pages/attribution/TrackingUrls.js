import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';
import setupStyle from 'styles/attribution/setup.css';
import copy from 'copy-to-clipboard';
import buttonsStyle from 'styles/onboarding/buttons.css';
import trackingStyle from 'styles/campaigns/tracking.css';
import Textfield from 'components/controls/Textfield';

export default class TrackingPlan extends Component {

  style = style;
  styles = [planStyles, setupStyle, buttonsStyle, trackingStyle];

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
    const { campaigns } = this.props;
    let rows = [];
    campaigns.forEach((campaign, campaignIndex) => {
      campaign.tracking && campaign.tracking.urls && campaign.tracking.urls.forEach((url, index) => {
        const utm = campaign.tracking.utms[index];
        rows.push(
          this.getTableRow(null, [
            campaign.name,
            utm.source,
            utm.medium,
            <div style={{ padding: '0 5px', marginBottom: '7px' }}>
              <Textfield inputClassName={ trackingStyle.locals.urlTextbox } style={{ width: '350px' }} value={ url.short } readOnly={true} onFocus={ (e) => e.target.select() }/>
              <div className={ trackingStyle.locals.copyToClipboard } onClick={ this.copy.bind(this, url.short) } style={{ marginTop: '-26px', marginLeft: '321px' }} data-checked={this.state.copied === url.short ? true : null}/>
            </div>,
            <div style={{ padding: '0 5px', marginBottom: '7px' }}>
              <Textfield inputClassName={ trackingStyle.locals.urlTextbox } style={{ width: '350px' }} value={ url.long } readOnly={true} onFocus={ (e) => e.target.select() }/>
              <div className={ trackingStyle.locals.copyToClipboard } onClick={ this.copy.bind(this, url.long) } style={{ marginTop: '-26px', marginLeft: '321px' }} data-checked={this.state.copied === url.long ? true : null}/>
            </div>,
            new Date(url.createDate).toLocaleDateString(),
          ], {
            key: campaignIndex + '$' + index
          })
        );
      })
    });

    const headRow = this.getTableRow(null, [
      'Campaign Name',
      'Campaign Source',
      'Campaign Medium',
      'Shortened Tracking URL',
      'Full Tracking URL',
      'Create Date'
    ], {
      className: setupStyle.locals.headRow
    });

    return <div>
      <div className={ planStyles.locals.innerBox }>
        <div className={ this.classes.wrap } ref="wrap">
          <div className={ this.classes.box } style={{ overflow: 'auto' }}>
            <table className={ this.classes.table }>
              <thead>
              { headRow }
              </thead>
              <tbody className={ setupStyle.locals.tableBody }>
              { rows }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object' ) {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}