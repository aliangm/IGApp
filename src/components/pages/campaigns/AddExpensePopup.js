import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/onboarding/onboarding.css';
import campaignPopupStyle from 'styles/campaigns/capmaign-popup.css';
import Title from 'components/onboarding/Title';
import SaveButton from 'components/pages/profile/SaveButton';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import Select from 'components/controls/Select';
import Calendar from 'components/controls/Calendar';
import MultiRow from 'components/MultiRow';
import {getDates} from 'components/utils/date';
import {extractNumberFromBudget, formatBudget} from 'components/utils/budget';
import {formatChannels} from 'components/utils/channels';
import {getProfileSync} from 'components/utils/AuthService';
import history from 'history';

export default class AddExpensePopup extends Component {

  style = style;
  styles = [campaignPopupStyle];

  defaultData = {
    name: '',
    owner: '',
    amount: '',
    type: '',
    dueDate: '',
    status: '',
    timeframe: [],
    assignedTo: {
      entityType: 'campaign',
      entityId: ''
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultData
    };
  }

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.assignedTo) {
      this.setState({...this.defaultData, ...{assignedTo: JSON.parse(this.props.location.query.assignedTo)}});
    }
  }

  removeTimeframe = () => {

  };

  handleChangeEntityId = (value) => {
    const assignedTo = {...this.state.assignedTo};
    assignedTo.entityId = value;
    this.setState({assignedTo: assignedTo});
  };

  addExpense = () => {
    const {name, owner, amount, type, dueDate, timeframe, assignedTo} = this.state;
    const timeFrameArray = new Array(12).fill(null);
    timeframe.forEach(item => {
      timeFrameArray[item.month] = item.amount;
    });
    const newExpense = {
      name,
      owner,
      amount,
      type,
      dueDate,
      assignedTo,
      lastUpdateTime: new Date(),
      timeframe: timeFrameArray
    };
    const expenses = [...this.props.expenses];
    expenses.push(newExpense);
    this.props.updateUserMonthPlan({expenses}, this.props.region, this.props.planDate);
  };

  close = () => {
    history.goBack();
  };

  save = () => {
    this.addExpense();
    this.close();
  };

  render() {
    const {name, owner, amount, type, dueDate, timeframe, assignedTo: {entityType, entityId}} = this.state;
    const {calculatedData: {activeCampaigns}} = this.props;
    const selects = {
      owner: {
        label: 'Owner',
        select: {
          name: 'owner',
          options: [
            {value: 'other', label: 'Other'}
          ]
        }
      },
      type: {
        label: 'Type',
        select: {
          name: 'type',
          options: [
            {value: 'Advertising', label: 'Advertising'},
            {value: 'Analyst Relations', label: 'Analyst Relations'},
            {value: 'Consultants/Agencies', label: 'Consultants/Agencies'},
            {value: 'Creative Services', label: 'Creative Services'},
            {value: 'Data', label: 'Data'},
            {value: 'Employee compensation', label: 'Employee compensation'},
            {value: 'Events', label: 'Events'},
            {value: 'Hospitality/Travel', label: 'Hospitality/Travel'},
            {value: 'Print', label: 'Print'},
            {value: 'Promotional Items', label: 'Promotional Items'},
            {value: 'Postage/Shipping', label: 'Postage/Shipping'},
            {value: 'Public Relations', label: 'Public Relations'},
            {value: 'Research', label: 'Research'},
            {value: 'Sponsorships', label: 'Sponsorships'},
            {value: 'Technical Services', label: 'Technical Services'},
            {value: 'Technology/Tools', label: 'Technology/Tools'},
            {value: 'Writing/Editing', label: 'Writing/Editing'},
            {value: 'Other', label: 'Other'}
          ]
        }
      }
    };

    this.props.teamMembers && this.props.teamMembers.forEach((member) => {
      const label = getProfileSync().app_metadata && getProfileSync().user_id === member.userId ? member.firstName + ' ' + member.lastName + ' (me)' : member.firstName + ' ' + member.lastName;
      selects.owner.select.options.push({value: member.userId, label: label});
    });

    const dates = getDates(this.props.planDate);
    const datesOptions = dates.map((item, index) => {
      return {label: item, value: index};
    });
    return <div>
      <Page popup={true} width={'700px'} onClose={this.close}>
        <Title className={campaignPopupStyle.locals.title} title='Add Expense'/>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <SaveButton onClick={this.save}/>
        </div>
        <div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.leftHalf}>
              <Label>Expense Name*</Label>
              <Textfield value={name}
                         required={true}
                         onChange={(e) => {
                           this.setState({name: e.target.value});
                         }}/>
            </div>
            <div className={this.classes.rightHalf}>
              <Select {...selects.owner}
                      selected={owner}
                      onChange={(e) => {
                        this.setState({owner: e.value});
                      }}/>
            </div>
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.leftHalf}>
              <Label>Total Amount</Label>
              <Textfield value={formatBudget(amount)}
                         onChange={(e) => {
                           this.setState({amount: extractNumberFromBudget(e.target.value)});
                         }}/>
            </div>
            <div className={this.classes.rightHalf}>
              <Select {...selects.type}
                      selected={type}
                      onChange={(e) => {
                        this.setState({type: e.value});
                      }}/>
            </div>
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.leftHalf}>
              <Label>Assign the expense’s timeframe</Label>
              <MultiRow numOfRows={timeframe.length || 1} rowRemoved={this.removeTimeframe}>
                {({index, data, update, removeButton}) => {
                  return <div style={{display: 'flex', marginBottom: '10px'}}>
                    <Select
                      style={{width: '90px'}}
                      selected={timeframe[index] && timeframe[index].month}
                      select={{
                        options: datesOptions
                      }}
                      onChange={(e) => {
                        const newTimeframe = [...timeframe];
                        const monthIndex = e.value;
                        if (!newTimeframe[index]) {
                          newTimeframe[index] = {
                            month: '',
                            amount: ''
                          };
                        }
                        newTimeframe[index].month = monthIndex;
                        this.setState({timeframe: newTimeframe});
                      }}
                    />
                    <Textfield value={timeframe[index] && timeframe[index].amount}
                               onChange={e => {
                                 const newTimeframe = [...timeframe];
                                 const amount = e.target.value;
                                 if (!newTimeframe[index]) {
                                   newTimeframe[index] = {
                                     month: '',
                                     amount: ''
                                   };
                                 }
                                 newTimeframe[index].amount = amount;
                                 this.setState({timeframe: newTimeframe});
                               }}
                               style={{width: '90px', marginLeft: '20px'}}/>
                    <div style={{marginLeft: '25px', alignSelf: 'center'}}>
                      {removeButton}
                    </div>
                  </div>;
                }}
              </MultiRow>
            </div>
            <div className={this.classes.rightHalf}>
              <Label>Due Date</Label>
              <Calendar value={dueDate} onChange={(v) => {
                this.setState({dueDate: v});
              }}/>
            </div>
          </div>
          <div className={this.classes.flexRow}>
            <Select select={{options: [{value: 'campaign', label: 'Campaign'}, {value: 'channel', label: 'Channel'}]}}
                    style={{width: '111px', marginRight: '19px'}}
                    selected={entityType}
                    onChange={(e) => {
                      const assignedTo = {...this.state.assignedTo};
                      assignedTo.entityType = e.value;
                      this.setState({assignedTo: assignedTo});
                    }}/>
            {entityType === 'campaign' ?
              <Select select={{
                options: activeCampaigns.map(item => {
                  return {value: item.index, label: item.name};
                })
              }}
                      style={{width: '111px'}}
                      selected={entityId}
                      onChange={(e) => {
                        this.handleChangeEntityId(e.value);
                      }}/>
              :
              <Select select={{options: formatChannels()}}
                      style={{width: '111px'}}
                      selected={entityId}
                      onChange={(e) => {
                        this.handleChangeEntityId(e.value);
                      }}/>
            }
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <SaveButton onClick={this.save}/>
        </div>
      </Page>
    </div>;
  }
}