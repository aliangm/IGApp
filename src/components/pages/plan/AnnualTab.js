import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';

import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Explanation from 'components/pages/plan/Explanation';

import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';

import annualData from 'data/annual';

export default class AnnualTab extends Component {
  styles = [planStyles, icons];
  style = style;
  state = {
    budget: 315000,
    whatIfSelected: false,

    popupShown: false,
    popupLeft: 0,
    pouppTop: 0,

    budgetField: '$',

    hoverRow: void 0,
    collapsed: {},
    tableCollapsed: false
  }

  onHeadClick = (e) => {
    const elem = e.currentTarget;
    const rect = elem.getBoundingClientRect();
    const wrapRect = ReactDOM.findDOMNode(this.refs.wrap).getBoundingClientRect();


    this.refs.headPopup.open();

    this.setState({
      popupShown: true,
      popupLeft: rect.left - wrapRect.left,
      popupTop: rect.top - wrapRect.top + rect.height
    });
  }

  changeBudget = () => {
    const budget = parseInt(this.state.budgetField.replace(/^\$/, ''));

    this.refs.budgetPopup.close();

    this.setState({
      budget: budget,
      budgetField: '$'
    });
  }

  render() {
    const data = annualData[this.state.budget];
    let rows = [];
    let hoverRows;

    const handleRows = (data, parent, level) => {
      level = level | 0;

      Object.keys(data).forEach((item, i) => {
        if (item === '__TOTAL__') return null;

        let key = parent + ':' + item + '-' + i;
        let collapsed = !!this.state.collapsed[key];

        const params = data[item];
        const values = params.values.map(val => '$' + val);
        const titleElem = <div
          style={{
            marginLeft: (level | 0) * 17 + 'px'
          }}
          className={ this.classes.rowTitle }
        >
          { params.children ?
            <div
              className={ this.classes.rowArrow }
              data-collapsed={ collapsed || null }
              onClick={() => {
                this.state.collapsed[key] = !collapsed;
                this.forceUpdate();
              }}
            />
          : null }

          { params.icon ?
            <div className={ this.classes.rowIcon } data-icon={ params.icon } />
          : null }

          { params.icon_mask ?
            <div className={ this.classes.rowMaskIcon }>
              <div className={ this.classes.rowMaskIconInside } data-icon={ params.icon_mask } />
            </div>
          : null }

          { item }
        </div>

        const rowProps = {
          key: key,
          onMouseEnter: () => {
            this.setState({
              hoverRow: key
            });
          },
          onMouseLeave: () => {
            this.setState({
              hoverRow: void 0
            });
          }
        };

        if (params.disabled) {
          rowProps['data-disabled'] = true;
        }

        if (this.state.hoverRow === key) {
          rowProps['data-hovered'] = true;
        }

        const row = this.getTableRow(titleElem, values, rowProps);
        rows.push(row);

        if (!collapsed && params.children) {
          handleRows(params.children, key, level + 1);
        }
      });
    }

    if (data && !this.state.tableCollapsed) {
      handleRows(data);
    }

    const headRow = this.getTableRow(<div className={ this.classes.headTitleCell }>
      <div
        className={ this.classes.rowArrow }
        data-collapsed={ this.state.tableCollapsed || null }
        onClick={() => {
          this.state.tableCollapsed = !this.state.tableCollapsed;
          this.forceUpdate();
        }}
      />
      { 'Promotion Channel' }
    </div>, [
      'Jan/16',
      'Feb/16',
      <div role="button" className={ this.classes.tableButton }>
        { 'Mar/16' }
      </div>,
      'Apr/16',
      <div role="button" className={
          this.state.popupShown ?
            this.classes.tableButtonSelected :
            this.classes.tableButton
        }
        onClick={ this.onHeadClick }
      >
        { 'May/16' }
      </div>,
      <div role="button" className={ this.classes.tableButton }>
        { 'Jun/16' }
      </div>,
      'Jul/16',
      'Aug/16',
      'Sep/16',
      'Oct/16',
      'Nov/16',
      'Dec/16'
    ], {
      className: this.classes.headRow
    });

    const footRow = data && this.getTableRow(<div className={ this.classes.footTitleCell }>
      { 'TOTAL' }
    </div>, data['__TOTAL__'].values.map(val => '$' + val), {
      className: this.classes.footRow
    });

    return <div>
      <div className={ planStyles.locals.title }>
        <div className={ planStyles.locals.titleMain }>
          <div className={ planStyles.locals.titleText }>
            Annual Budget
          </div>
          <div className={ planStyles.locals.titlePrice }>
            ${ this.state.budget }
          </div>
        </div>
        <div className={ planStyles.locals.titleButtons }>
          <Button type="primary2" style={{
            width: '106px'
          }}>Export</Button>
          <Button type="primary2" style={{
            marginLeft: '15px',
            width: '106px'
          }} selected={ this.state.whatIfSelected ? true : null } onClick={() => {
            this.setState({
              whatIfSelected: true
            });

            this.refs.budgetPopup.open();
          }}>What if</Button>

          <div style={{ position: 'relative' }}>
            <PlanPopup ref="budgetPopup" style={{
              width: '367px',
              right: '0',
              left: 'auto',
              top: '20px'
            }} onClose={() => {
              this.setState({
                budgetField: '$',
                whatIfSelected: false
              });
            }} title="CHANGE YOUR BUDGET">
              <div className={ this.classes.budgetChangeBox }>
                <Textfield
                  value={ this.state.budgetField }
                  className={ this.classes.budgetChangeField }
                  onChange={(e) => {
                    this.setState({
                      budgetField: e.target.value
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      this.changeBudget();
                    }
                  }}
                />
                <Button type="accent2" style={{
                  width: '91px',
                  marginLeft: '15px'
                }} onClick={ this.changeBudget }>Done</Button>
              </div>
            </PlanPopup>
          </div>
        </div>
      </div>
      <div className={ planStyles.locals.innerBox }>
        <div className={ this.classes.wrap } ref="wrap">
          <div className={ this.classes.box }>
            <table className={ this.classes.table }>
              <thead>
                { headRow }
              </thead>
              <tbody className={ this.classes.tableBody }>
                { rows }
              </tbody>
              <tfoot>
                { footRow }
              </tfoot>
            </table>
          </div>

          <div className={ this.classes.hoverBox }>
            <table className={ this.classes.hoverTable }>
              <thead>{ headRow }</thead>
              <tbody>{ rows }</tbody>
              <tfoot>{ footRow }</tfoot>
            </table>
          </div>

          <PlanPopup ref="headPopup" style={{
            width: '350px',
            left: this.state.popupLeft + 'px',
            top: this.state.popupTop + 'px',
            marginTop: '5px'
          }} title="Events: Mar/16"
            onClose={() => {
              this.setState({
                popupShown: false,
                popupLeft: 0,
                popupTop: 0
              });
            }}
          >
            <PopupTextContent>
              <strong>User Events</strong>
              <p>With the exception of Nietzsche, no other madman has contributed so much to human sanity as has Louis Althusser. He is mentioned twice in the Encyclopaedia Britannica as someone’s teacher.</p>
              <strong>Global Events</strong>
              <p>Thought experiments (Gedankenexperimenten) are “facts” in the sense that they have a “real life” correlate in the form of electrochemical activity in the brain. But it is quite obvious that they do not</p>
            </PopupTextContent>
          </PlanPopup>
        </div>
      </div>

      <Explanation title="Explanation" text="Your strategy was built based on 89 experts and statistical analysis of 23 similar companies.
The 2 main fields (channels) that are recommended to you in the current month are: Advertising and Public Relations. 81% of similar companies to yours are using Advertising as the main channel in their strategy in we thought that you should too. In contrary, only 22% of these companies are using Public Relations as one of the main channels. But in your case, we thought that this channel would be a perfect fit to your marketing mix due to the fact that your main goal is getting as much awareness as possible." />
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
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