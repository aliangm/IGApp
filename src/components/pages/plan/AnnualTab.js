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

//import annualData from 'data/annual';
import { parseAnnualPlan } from 'data/parseAnnualPlan';
import serverCommunication from 'data/serverCommunication';

export default class AnnualTab extends Component {
  styles = [planStyles, icons];
  style = style;
  state = {
    //budget: 315000,
    whatIfSelected: false,
    popupShown: false,
    popupLeft: 0,
    pouppTop: 0,

    budgetField: '$',

    hoverRow: void 0,
    collapsed: {},
    tableCollapsed: false
  }

  constructor(props) {
    super(props);
    this.state = {
      //budget: 315000,
      whatIfSelected: false,
      popupShown: false,
      popupLeft: 0,
      pouppTop: 0,

      budgetField: '$',

      hoverRow: void 0,
      collapsed: {},
      tableCollapsed: false,
      annualData: {}
    }
  }

  componentDidMount(){
    let self = this;
    serverCommunication.serverRequest('GET', 'usermonthplan')
      .then((response) => {
        response.json()
          .then(function (data) {
            if (data) {
              //self.setState({projectedPlan: data.projectedPlan});
              self.setState({budget: data.annualBudget});
              self.setState({planDate: data.planDate});
              self.setState({annualData: parseAnnualPlan(data.projectedPlan)});
              self.setState({isLoaded: true});
            }
          })
      })
      .catch(function (err) {
        console.log(err);
      })
  }
  /**
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
   **/

  getDates = () => {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var dates = [];
    for (var i = 0; i < 12; i++) {
      var date = new Date(this.state.planDate);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2));
    }
    return dates;
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
    const data = this.state.annualData[this.state.budget];

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
            <div className={ this.classes.rowIcon } data-icon={ params.icon }/>
            : null }

          { params.icon_mask ?
            <div className={ this.classes.rowMaskIcon }>
              <div className={ this.classes.rowMaskIconInside } data-icon={ params.icon_mask }/>
            </div>
            : null }
          { item.length > 15 ?
            <div>{item.substr(0, item.lastIndexOf(' ')) } <br/> {item.substr(item.lastIndexOf(' ') + 1, item.length)}
            </div>
            : item }
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
    </div>, this.getDates(), {
      className: this.classes.headRow
    });

    const footRow = data && this.getTableRow(<div className={ this.classes.footTitleCell }>
        { 'TOTAL' }
      </div>, data['__TOTAL__'].values.map(val => '$' + val), {
        className: this.classes.footRow
      });

    return <div>
      <div className={ this.classes.wrap } data-loading={ this.state.isLoaded ? null : true }>
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
                <p>With the exception of Nietzsche, no other madman has contributed so much to human sanity as has Louis
                  Althusser. He is mentioned twice in the Encyclopaedia Britannica as someone’s teacher.</p>
                <strong>Global Events</strong>
                <p>Thought experiments (Gedankenexperimenten) are “facts” in the sense that they have a “real life”
                  correlate in the form of electrochemical activity in the brain. But it is quite obvious that they do
                  not</p>
              </PopupTextContent>
            </PlanPopup>
          </div>
        </div>
      </div>
      { !this.state.isLoaded ?
        <div className={ this.classes.loading }>
          <Popup className={ this.classes.popup }>
            <div>
              <Loading />
            </div>

            <div className={ this.classes.popupText }>
              Please wait while the system creates your plan
            </div>
          </Popup>
        </div>
        : null }
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