import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import Button from 'components/controls/Button';
import Page from 'components/Page';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import preferencesStyle from 'styles/preferences/preferences.css';
import style from 'styles/onboarding/onboarding.css';
import popupStyle from 'styles/welcome/add-member-popup.css';
import { getIndicatorsWithNicknames, getNickname } from 'components/utils/indicators';
import Calendar from 'components/controls/Calendar';
import Toggle from 'components/controls/Toggle';
import NotSure from 'components/onboarding/NotSure';
import ButtonsSet from 'components/pages/profile/ButtonsSet';
import navStyle from 'styles/profile/market-fit-popup.css';
import { timeFrameToDate } from 'components/utils/objective';

export default class AddObjectivePopup extends Component {

  style = style;
  styles = [popupStyle, preferencesStyle, navStyle];

  constructor(props) {
    super(props);
    this.state = {
      indicator: '',
      isRecurrent: false,
      isMonthly: true,
      amount: '',
      isPercentage: '',
      direction: '',
      timeFrame: '',
      order: props.objectives.length,
      notSure: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      const objective = this.props.objectives[nextProps.index];
      if (objective) {
        this.setState({... objective, order: nextProps.index});
      }
      else {
        this.setState({
          indicator: '',
          isRecurrent: false,
          isMonthly: true,
          amount: '',
          isPercentage: '',
          direction: '',
          timeFrame: '',
          order: nextProps.objectives.length,
          notSure: 0
        });
      }
    }
  }

  calculateObjective() {
    const d1 = new Date();
    const d2 = timeFrameToDate(this.state.timeFrame);
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    if (months <= 0) {
      months = 0;
    }
    if (months > 11) {
      months = 11;
    }
    const value = Math.round((this.props.projectedPlan[months].projectedIndicatorValues[this.state.indicator] - this.props.actualIndicators[this.state.indicator]) * this.state.aggressiveLevel + this.props.actualIndicators[this.state.indicator]);
    this.setState({
      amount: value,
      isPercentage: false,
      direction: 'equals',
      notSure: 3
    });
  }

  render() {
    const directionOptions = [
      {label: 'increase', value: 'increase'},
      {label: 'decrease', value: 'decrease'},
    ];
    if (!this.state.isRecurrent) {
      directionOptions.push({label: '(target)', value: 'equals'});
    }
    const objectivesOrder = this.props.objectives.map((item, index) => {
      return {value: index, label: '#' + (index + 1)}
    });
    objectivesOrder.push({value: this.props.objectives.length, label: '#' + (this.props.objectives.length + 1)});
    return <div hidden={ this.props.hidden }>
      { this.state.notSure ?
        <Page popup={true} width={'600px'} contentClassName={popupStyle.locals.content}
              innerClassName={popupStyle.locals.inner}>
          <div className={popupStyle.locals.title}>
            Objective Assistant
          </div>
          <div>
            {
              this.state.notSure === 1 ?
                <div>
                  <div className={this.classes.row}>
                    <Label style={{ justifyContent: 'center', textTransform: 'capitalize', fontSize: '15px' }}>
                      Add a Due date
                    </Label>
                    <div style={{width: '200px', margin: 'auto', paddingLeft: '35px'}}>
                      <Calendar value={this.state.timeFrame} onChange={(e) => {
                        this.setState({timeFrame: e})
                      }}/>
                    </div>
                  </div>
                  <div className={ navStyle.locals.nav }>
                    <Button type="normal-accent" style={{
                      width: '100px',
                      marginRight: '20px'
                    }} onClick={ () => { this.setState({notSure: 0}) } }>
                      <div className={ navStyle.locals.backIcon } />
                      BACK
                    </Button>
                    <Button type="accent" style={{
                      width: '100px'
                    }} onClick={ () => { this.setState({notSure: 2}) } }>
                      NEXT
                      <div className={ navStyle.locals.nextIcon } />
                    </Button>
                  </div>
                </div>
                : this.state.notSure === 2 ?
                <div>
                  <div className={this.classes.row}>
                    <Label style={{ justifyContent: 'center', textTransform: 'capitalize', fontSize: '15px' }}>How aggressive you’re willing to be with the objective?</Label>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                      <ButtonsSet buttons={[
                        {key: 0.5, text: 'Light', icon: 'buttons:light'},
                        {key: 0.75, text: 'Caution', icon: 'buttons:caution'},
                        {key: 1, text: 'Moderate', icon: 'buttons:moderate'},
                        {key: 1.25, text: 'Aggressive', icon: 'buttons:aggressive'},
                        {key: 1.5, text: 'Optimistic', icon: 'buttons:optimistic'},
                      ]} selectedKey={this.state.aggressiveLevel}
                                  onChange={(e) => {
                                    this.setState({aggressiveLevel: e})
                                  }}/>
                    </div>
                  </div>
                  <div className={ navStyle.locals.nav }>
                    <Button type="normal-accent" style={{
                      width: '100px',
                      marginRight: '20px'
                    }} onClick={ () => { this.setState({notSure: 1}) } }>
                      <div className={ navStyle.locals.backIcon } />
                      BACK
                    </Button>
                    <Button type="accent" style={{
                      width: '100px'
                    }} onClick={ this.calculateObjective.bind(this) }>
                      NEXT
                      <div className={ navStyle.locals.nextIcon } />
                    </Button>
                  </div>
                </div>
                : this.state.notSure === 3 ?
                  <div>
                    <div className={this.classes.row}>
                      <Label style={{ justifyContent: 'center', textTransform: 'none', fontSize: '15px', fontWeight: '500', whiteSpace: 'pre' }}>
                        {"I want to reach a target of "} <span style={{fontWeight: '700'}}>{this.state.amount}</span>{" " + getNickname(this.state.indicator) +" by " + this.state.timeFrame}
                      </Label>
                    </div>
                    <div className={ navStyle.locals.nav }>
                      <Button type="normal-accent" style={{
                        width: '100px',
                        marginRight: '20px'
                      }} onClick={ () => { this.setState({amount: '',
                        isPercentage: '',
                        direction: '',
                        notSure: 0,
                        aggressiveLevel: ''}) } }>
                        <div className={ navStyle.locals.backIcon } />
                        Don't use
                      </Button>
                      <Button type="accent" style={{
                        width: '100px'
                      }} onClick={ () => {
                        this.setState({notSure: 0, aggressiveLevel: ''}, () => {
                          this.props.createOrUpdateObjective(this.state, this.props.index)
                        });
                      } }>
                        Use
                        <div className={ navStyle.locals.nextIcon } />
                      </Button>
                    </div>
                  </div>
                  : null
            }
          </div>
        </Page>
        :
        <Page popup={true} width={'400px'} contentClassName={popupStyle.locals.content}
              innerClassName={popupStyle.locals.inner}>
          <div className={popupStyle.locals.title}>
            Add Objective
          </div>
          <div className={this.classes.row}>
            <Label>
              Choose metrics as objective
            </Label>
            <Select
              selected={this.state.indicator}
              select={{
                placeholder: 'KPI',
                options: getIndicatorsWithNicknames()
              }}
              onChange={(e) => {
                this.setState({indicator: e.value, currentValue: this.props.actualIndicators[e.value] || 0})
              }}
              style={{width: '200px'}}
              ref="indicator"
            />
          </div>
          <div className={this.classes.row} style={{display: 'flex'}}>
            <Toggle
              leftText="One Time"
              rightText="Recurrent"
              leftActive={!this.state.isRecurrent}
              leftClick={() => {
                this.setState({isRecurrent: false})
              }}
              rightClick={() => {
                this.setState({isRecurrent: true})
              }}
              type="grey"
            />
          </div>
          <div className={this.classes.row}>
            <Label>
              Numeric objective
              { this.state.isRecurrent ? null :
                <NotSure style={{
                  marginLeft: '75px'
                }} onClick={() => {
                  if (this.state.indicator) {
                    this.setState({notSure: 1});
                  }
                  else {
                    this.refs.indicator.focus();
                  }
                }}/>
              }
            </Label>
            <div style={{display: 'inline-flex'}}>
              <Textfield type="number" value={this.state.amount} onChange={(e) => {
                this.setState({amount: parseInt(e.target.value)})
              }} style={{width: '102px'}}/>
              <Select
                selected={this.state.isPercentage}
                select={{
                  options: [{label: '%', value: true}, {label: '(num)', value: false}]
                }}
                onChange={(e) => {
                  this.setState({isPercentage: e.value})
                }}
                placeholder='%/num'
                style={{marginLeft: '20px', width: '78px'}}
              />
              <Select
                selected={this.state.direction}
                select={{
                  options: directionOptions
                }}
                onChange={(e) => {
                  this.setState({direction: e.value})
                }}
                placeholder='Direction'
                style={{marginLeft: '20px', width: '104px'}}
              />
            </div>
          </div>
          {!this.state.isRecurrent ?
            <div className={this.classes.row}>
              <Label>
                Due date
              </Label>
              <div style={{width: '200px'}}>
                <Calendar value={this.state.timeFrame} onChange={(e) => {
                  this.setState({timeFrame: e})
                }}/>
              </div>
            </div>
            :
            <div className={this.classes.row} style={{display: 'flex'}}>
              <Toggle
                leftText="Monthly"
                rightText="Quarterly"
                leftActive={this.state.isMonthly}
                leftClick={() => {
                  this.setState({isMonthly: true})
                }}
                rightClick={() => {
                  this.setState({isMonthly: false})
                }}
                type="grey"
              />
            </div>
          }
          <div className={this.classes.row}>
            <Label>
              Order
            </Label>
            <Select
              selected={this.state.order}
              select={{
                options: objectivesOrder
              }}
              onChange={(e) => {
                this.setState({order: parseInt(e.value)})
              }}
              style={{width: '75px'}}
            />
          </div>
          <div className={this.classes.footerCols}>
            <div className={this.classes.footerLeft}>
              <Button
                type="reverse"
                style={{width: '72px'}}
                onClick={this.props.close}>Cancel
              </Button>
              <Button
                type="primary2"
                style={{width: '110px', marginLeft: '20px'}}
                onClick={() => {
                  this.props.createOrUpdateObjective(this.state, this.props.index)
                }}>
                {this.props.index !== undefined ? 'Edit Objective' : 'Add Objective'}
              </Button>
            </div>
          </div>
        </Page>
      }
    </div>
  }
}