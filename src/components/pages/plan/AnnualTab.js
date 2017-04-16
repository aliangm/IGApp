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
import Label from 'components/ControlsLabel';

import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
//import annualData from 'data/annual';
import { parseAnnualPlan } from 'data/parseAnnualPlan';
import serverCommunication from 'data/serverCommunication';

export default class AnnualTab extends Component {
  styles = [planStyles, icons];
  style = style;

  budgetWeights= [0.07,	0.11,	0.13,	0.13,	0.11,	0.05,	0.04,	0.04,	0.09,	0.09,	0.12,	0.02];

  constructor(props) {
    super(props);
    this.state = {
      //budget: 315000,
      whatIfSelected: false,
      popupShown: false,
      popupLeft: 0,
      pouppTop: 0,

      budgetField: props.budget || '',
      budgetArrayField: props.budgetArray || [],
      maxChannelsField: props.maxChannels || '',
      isCheckAnnual: !!props.budget,

      hoverRow: void 0,
      collapsed: {},
      tableCollapsed: false,
      annualData: {}
    }
    this.whatIf = this.whatIf.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ budgetField: nextProps.budget });
    this.setState({ budgetArrayField: nextProps.budgetArray });
    this.setState({maxChannelsField: nextProps.maxChannels});
  }
  /**
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
  }**/
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
      var planDate = this.props.planDate.split("/");
      var date = new Date(planDate[1], planDate[0]-1);
      date.setMonth(date.getMonth() + i);
      dates.push(monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2,2));
    }
    return dates;
  }

  whatIf = (isCommitted, callback) => {
    this.setState({whatIfSelected: false});
    let preferences = {};

    preferences.annualBudgetArray = this.state.budgetArrayField;
    preferences.annualBudget = this.state.budgetField;
    const maxChannels = parseInt(this.state.maxChannelsField);
    if (isNaN(maxChannels)) {
      preferences.maxChannels = -1;
    }
    else {
      preferences.maxChannels = maxChannels;
    }
    let filterNanArray = preferences.annualBudgetArray.filter((value)=>{return !!value});
    if (filterNanArray.length == 12 && preferences.maxChannels) {
      this.props.whatIf(isCommitted, preferences, callback, this.props.region);
    }
    /**
     this.setState({
      budget: budget,
      budgetField: '$'
    });**/
  }

  whatIfCommit = () => {
    let callback = () => {
      this.refs.whatIfPopup.close();
      this.setState({whatIfSelected: false, isTemp: false});
    }
    this.whatIf(true, callback);
  }

  whatIfTry = () => {
    let callback = () => {
      this.refs.whatIfPopup.open();
      this.setState({whatIfSelected: true, isTemp: true});
    }
    this.whatIf(false, callback);
  }

  whatIfCancel = () => {
    this.refs.whatIfPopup.close();
    this.setState({whatIfSelected: false, isTemp: false, budgetField: '', maxChannelsField: ''});
    this.props.close(this.props.region);
  }

  handleChangeBudget(event) {
    let update = {};
    update.budgetField = parseInt(event.target.value.replace(/[-$,]/g, ''));

    let planDate = this.props.planDate.split("/");
    let firstMonth = parseInt(planDate[0]) - 1;

    let budget = [];
    this.budgetWeights.forEach((element, index) => {
      budget[(index + 12 - firstMonth) % 12] = Math.round(element * update.budgetField);
    });
    update.budgetArrayField = budget;

    this.setState(update);
  }

  handleChangeBudgetArray(index, event) {
    let update = this.state.budgetArrayField || [];
    update.splice(index, 1, parseInt(event.target.value.replace(/[-$,]/g, '')));
    this.setState({budgetArrayField: update});
  }

  monthBudgets() {
    const datesArray = this.getDates();
    return datesArray.map((month, index) => {
      return <div className={ this.classes.budgetChangeBox } key={index} style={{ marginLeft: '8px', paddingBottom: '0px', paddingTop: '0px' }}>
        <div className={ this.classes.left }>
          <Label style={{width: '70px', marginTop: '8px'}}>{month}</Label>
        </div>
        <div className={ this.classes.right }>
          <Textfield
            value={"$" + (this.state.budgetArrayField[index] ? this.state.budgetArrayField[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
            onChange={ this.handleChangeBudgetArray.bind(this, index) } style={{
            width: '110px'
          }}/>
        </div>
      </div>
    });
  }

  toggleCheck() {
    if (this.state.isCheckAnnual) {
      let prevBudget = this.state.budgetField;
      let planDate = this.props.planDate.split("/");
      let firstMonth = parseInt(planDate[0]) - 1;

      let budget = [];
      this.budgetWeights.forEach((element, index) => {
        budget[(index + 12 - firstMonth) % 12] = Math.round(element * prevBudget);
      });

      this.setState({budgetField: null, budgetArrayField: budget});
    }
    else {
      let sum = this.state.budgetArrayField.reduce((a, b) => a + b, 0);
      this.setState({budgetField: sum});
    }
    this.setState({isCheckAnnual: !this.state.isCheckAnnual});
  }

  render() {
    if (this.props.isLoaded) {
      if (!this.props.isPlannerLoading) {
        const planJson = parseAnnualPlan(this.props.projectedPlan);
        let budget = Object.keys(planJson)[0];
        const data = planJson[budget];
        budget = Math.ceil(budget/1000)*1000;
        let rows = [];
        let hoverRows;

        const handleRows = (data, parent, level) => {
          level = level | 0;

          Object.keys(data).forEach((item, i) => {
            if (item === '__TOTAL__') return null;

            let key = parent + ':' + item + '-' + i;
            let collapsed = !!this.state.collapsed[key];
            const params = data[item];
            const values = params.values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
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
              {/**   { item.length > 13 ?
                <div>{ item.substr(0, item.lastIndexOf(' ', 13)) }
                  <br/> { item.substr(item.lastIndexOf(' ', 13) + 1, item.length) }
                </div>
                : item }**/}
              {item}
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
          { 'Marketing Channel' }
        </div>, this.getDates(), {
          className: this.classes.headRow
        });

        const footRow = data && this.getTableRow(<div className={ this.classes.footTitleCell }>
            { 'TOTAL' }
          </div>, data['__TOTAL__'].values.map(val => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')), {
            className: this.classes.footRow
          });

        return <div>
          <div className={ this.classes.wrap } data-loading={ this.props.isLoaded ? null : true }>
            <div className={ planStyles.locals.title }>
              <div className={ planStyles.locals.titleMain }>
                <div className={ planStyles.locals.titleText }>
                  Annual Budget
                </div>
                <div className={ planStyles.locals.titlePrice } ref="budgetRef" style={{ color: this.state.isTemp ? '#1991eb' : 'Inherit' }}>
                  ${ budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{this.state.isTemp ? '*' : ''}
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

                  this.refs.whatIfPopup.open();
                }}>What if</Button>

                <div style={{ position: 'relative' }}>
                  <PlanPopup ref="whatIfPopup" style={{
                    width: '367px',
                    right: '110px',
                    left: 'auto',
                    top: '-37px'
                  }} hideClose={ true } title="What If - Scenarios Management">
                    <div className={ this.classes.budgetChangeBox } style={{ paddingTop: '12px' }}>
                      <div className={ this.classes.left }>
                        <Label checkbox={this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } style={{ paddingTop: '7px' }}>Plan Annual Budget ($)</Label>
                      </div>
                      <div className={ this.classes.right }>
                        <Textfield style={{ maxWidth: '110px' }}
                                   value={ '$' + (this.state.budgetField ? this.state.budgetField.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '') }
                                   className={ this.classes.budgetChangeField }
                                   onChange={ this.handleChangeBudget.bind(this) }
                                   onKeyDown={(e) => {
                                     if (e.keyCode === 13) {
                                       this.whatIf();
                                     }
                                   }}
                                   disabled={ !this.state.isCheckAnnual }
                        />
                      </div>
                    </div>
                    <div className={ this.classes.budgetChangeBox } style={{ display: 'inline-block' }}>
                      <div className={ this.classes.left }>
                        <div className={ this.classes.left }>
                          <Label checkbox={!this.state.isCheckAnnual} toggleCheck={ this.toggleCheck.bind(this) } style={{ paddingTop: '7px' }}>Plan Monthly Budget ($)</Label>
                        </div>
                      </div>
                      { this.state.isCheckAnnual ? null : this.monthBudgets() }
                    </div>
                    <div className={ this.classes.budgetChangeBox }>
                      <div className={ this.classes.left }>
                        <Label style={{ paddingTop: '7px' }}>max number of Channels</Label>
                      </div>
                      <div className={ this.classes.right }>
                        <Textfield style={{
                          maxWidth: '110px' }}
                                   value={ this.state.maxChannelsField != -1 ? this.state.maxChannelsField : '' }
                                   className={ this.classes.budgetChangeField }
                                   onChange={(e) => {
                                     this.setState({
                                       maxChannelsField: e.target.value
                                     });
                                   }}
                                   onKeyDown={(e) => {
                                     if (e.keyCode === 13) {
                                       this.whatIf();
                                     }
                                   }}
                        />
                      </div>
                    </div>
                    <div className={ this.classes.budgetChangeBox }>
                      <Button type="primary2" style={{
                        width: '110px'
                      }} onClick={ this.whatIfTry }>Try</Button>
                    </div>
                    <div className={ this.classes.budgetChangeBox } style={{ paddingBottom: '12px' }}>
                      <div className={ this.classes.left }>
                        <Button type="normal" style={{
                          width: '110px'
                        }} onClick={ this.whatIfCancel }>Cancel</Button>
                      </div>
                      <div className={ this.classes.right }>
                        <Button type="accent2" style={{
                          width: '110px'
                        }} onClick={ this.whatIfCommit }>Commit</Button>
                      </div>
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
                    <p>With the exception of Nietzsche, no other madman has contributed so much to human sanity as has
                      Louis
                      Althusser. He is mentioned twice in the Encyclopaedia Britannica as someone’s teacher.</p>
                    <strong>Global Events</strong>
                    <p>Thought experiments (Gedankenexperimenten) are “facts” in the sense that they have a “real life”
                      correlate in the form of electrochemical activity in the brain. But it is quite obvious that they
                      do
                      not</p>
                  </PopupTextContent>
                </PlanPopup>
              </div>
            </div>
          </div>
        </div>
      } else {
        return <div className={ this.classes.loading }>
          <Popup className={ this.classes.popup }>
            <div>
              <Loading />
            </div>

            <div className={ this.classes.popupText }>
              Please wait while the system creates your plan
            </div>
          </Popup>
        </div>
      }
    }
    else return null;
  }

  getTableRow(title, items, props)
  {
    return <tr {... props}>
      <td className={ this.classes.titleCell }>{ this.getCellItem(title) }</td>
      {
        items.map((item, i) => {
          if (i==0) {
            return <td className={ this.classes.valueCellFirst } key={ i }>{
              this.getCellItem(item)
            }</td>
          }
          return <td className={ this.classes.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item)
  {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={ this.classes.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}