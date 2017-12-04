import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/plan/planned-actual-tab.css';
import planStyles from 'styles/plan/plan.css';
import setupStyle from 'styles/attribution/setup.css';
import copy from 'copy-to-clipboard';
import buttonsStyle from 'styles/onboarding/buttons.css';

export default class TrackingPlan extends Component {

  style = style;
  styles = [planStyles, setupStyle, buttonsStyle];

  static defaultProps = {
    attribution: {
      events: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: ''
    };
  }

  copy(value, index) {
    this.setState({copied: ''});
    copy(value);
    this.setState({copied: index});
  }

  deleteEvent(index) {
    const events = this.props.attribution.events;
    events.splice(index, 1);
    this.props.updateUserMonthPlan({'attribution.events': events}, this.props.region, this.props.planDate);
  }

  render() {
    const rows = this.props.attribution.events.map((item, i) => {
      const trackingCode = `analytics.track('${item.name}', {
  type: '${item.type}'${item.description ? `,
  description: '${item.description}'` : ''}
});`;
      return this.getTableRow(null, [
        item.name,
        item.type,
        item.description,
        item.url,
        <div className={ setupStyle.locals.codeWrap }>
          <div className={ setupStyle.locals.snippetBox } style={{ margin: '12px', width: '400px' }}>
          <pre className={ setupStyle.locals.snippet }>
            {trackingCode}
          </pre>
          </div>
          <div>
            <div style={{ display: 'flex', marginTop: '21px', marginRight: '12px' }}>
              <Button type="reverse"
                      onClick={ this.copy.bind(this, trackingCode, i) }
                      icon="buttons:copy"
                      style={{
                        width: '100px'
                      }}
              >
                Copy
              </Button>
              <div className={ setupStyle.locals.copyMessage } hidden={ this.state.copied !== i }>
                Copied!
              </div>
            </div>
            <Button type="warning"
                    onClick={ this.deleteEvent.bind(this, i) }
                    style={{
                      width: '100px',
                      marginTop: '10px'
                    }}
            >
              Delete
            </Button>
          </div>
        </div>
      ], {
        key: i
      });
    });

    const headRow = this.getTableRow(null, [
      'Name',
      'Type',
      'Description',
      'Web Page URL',
      'Tracking Code'
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