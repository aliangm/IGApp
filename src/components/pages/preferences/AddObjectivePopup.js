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
import { getIndicatorsWithNicknames } from 'components/utils/indicators';
import Calendar from 'components/controls/Calendar';

export default class AddObjectivePopup extends Component {

  style = style;
  styles = [popupStyle, preferencesStyle];

  constructor(props) {
    super(props);
    this.state = {
      indicator: '',
      amount: '',
      isPercentage: '',
      direction: '',
      timeFrame: '',
      order: props.objectives.length
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
          amount: '',
          isPercentage: '',
          direction: '',
          timeFrame: '',
          order: nextProps.objectives.length
        });
      }
    }
  }

  render() {
    const objectivesOrder = this.props.objectives.map((item, index) => {
      return {value: index, label: '#' + (index + 1)}
    });
    objectivesOrder.push({value: this.props.objectives.length, label: '#' + (this.props.objectives.length + 1)});
    return <div hidden={ this.props.hidden }>
      <Page popup={ true } width={'400px'} contentClassName={ popupStyle.locals.content } innerClassName={ popupStyle.locals.inner }>
        <div className={ popupStyle.locals.title }>
          Add Objective
        </div>
        <div className={ this.classes.row }>
          <Label>
            Choose metrics as objective
          </Label>
          <Select
            selected={ this.state.indicator }
            select={{
              placeholder: 'KPI',
              options: getIndicatorsWithNicknames()
            }}
            onChange={ (e)=>{ this.setState({indicator: e.value, currentValue: this.props.actualIndicators[e.value] || 0}) } }
            style={{ width: '200px' }}
          />
        </div>
        <div className={ this.classes.row }>
          <Label>
            Numeric objective
          </Label>
          <div style={{ display: 'inline-flex' }}>
            <Textfield type="number" value={ this.state.amount } onChange={ (e)=>{ this.setState({amount: parseInt(e.target.value)}) } } style={{ width: '102px' }}/>
            <Select
              selected={ this.state.isPercentage }
              select={{
                options: [{label: '%', value: true}, {label: '(num)', value: false}]
              }}
              onChange={ (e)=>{ this.setState({isPercentage: e.value}) } }
              placeholder='%/num'
              style={{ marginLeft: '20px', width: '78px' }}
            />
            <Select
              selected={ this.state.direction }
              select={{
                options: [{label: 'increase', value: 'increase'}, {
                  label: 'decrease',
                  value: 'decrease'
                }, {label: '(target)', value: 'equals'}]
              }}
              onChange={ (e)=>{ this.setState({direction: e.value}) } }
              placeholder='Direction'
              style={{ marginLeft: '20px', width: '104px' }}
            />
          </div>
        </div>
        <div className={ this.classes.row }>
          <Label>
            Due date
          </Label>
          <div style={{ width: '200px' }}>
            <Calendar value={ this.state.timeFrame } onChange={ (e)=>{ this.setState({timeFrame: e}) } }/>
          </div>
        </div>
        <div className={ this.classes.row }>
          <Label>
            Order
          </Label>
          <Select
            selected={ this.state.order }
            select={{
              options: objectivesOrder
            }}
            onChange={ (e)=>{ this.setState({order: parseInt(e.value)}) } }
            style={{width: '75px'}}
          />
        </div>
        <div className={ this.classes.footerCols }>
          <div className={ this.classes.footerLeft }>
            <Button
              type="reverse"
              style={{ width: '72px' }}
              onClick={ this.props.close }>Cancel
            </Button>
            <Button
              type="primary2"
              style={{ width: '110px', marginLeft: '20px' }}
              onClick={ () => {this.props.createOrUpdateObjective(this.state, this.props.index)} }>
              { this.props.index !== undefined ? 'Edit Objective' : 'Add Objective' }
            </Button>
          </div>
        </div>
      </Page>
    </div>
  }
}