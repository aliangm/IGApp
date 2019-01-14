import React from 'react';
import Component from 'components/Component';
import Table from 'components/controls/Table';
import Button from 'components/controls/Button';
import MappingRule from 'components/pages/settings/channels/tabs/common/MappingRule';
import ChannelsSelect from 'components/common/ChannelsSelect';
import SaveButton from 'components/pages/profile/SaveButton';
import {isNil} from 'lodash';

export default class UnmappedTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      conditions: [props.getNewCondition()],
      channel: ''
    };
  }

  updateCondition = (index, param, value) => {
    const conditions = [...this.state.conditions];
    conditions[index][param] = value;
    this.setState({conditions});
  };

  addCondition = () => {
    const conditions = [...this.state.conditions];
    conditions.push(this.props.getNewCondition());
    this.setState({conditions});
  };

  deleteCondition = (index) => {
    let conditions = [...this.state.conditions];
    if (index) {
      conditions.splice(index, 1);
    }
    else {
      // Prevent user for deleting the first condition - initialize it instead
      conditions = [this.props.getNewCondition()];
    }
    this.setState({conditions});
  };

  createUtmConditions = (source, medium) => {
    const conditions = [];
    if (!isNil(source)) {
      conditions.push({
        value: source,
        param: 'source',
        operation: 'equals'
      });
    }
    if (!isNil(medium)) {
      conditions.push({
        value: medium,
        param: 'medium',
        operation: 'equals'
      });
    }
    this.setState({conditions});
  };

  render() {
    const {unmappedUrls, unmappedUtms} = this.props;
    const {conditions, channel} = this.state;
    const unmappedUrlsRows = unmappedUrls && unmappedUrls.map(row => {
        return {
          items: [
            row.referrer_url,
            row.count,
            <div>
              <Button type="primary"
                      style={{width: '102px'}}
                      onClick={() => {
                        this.setState({
                          conditions: [{
                            value: row.referrer_url,
                            param: 'referrer',
                            operation: 'contains'
                          }]
                        });
                        this.channelsSelect.focus();
                      }}>
                Map
              </Button>
            </div>
          ]
        };
      }
    );

    const unmappedUtmsRows = unmappedUtms && unmappedUtms.map(row => {
        return {
          items: [
            row.utm_source,
            row.utm_medium,
            row.count,
            <div>
              <Button type="primary"
                      style={{width: '102px'}}
                      onClick={() => {
                        this.createUtmConditions(row.utm_source, row.utm_medium);
                        this.channelsSelect.focus();
                      }}>
                Map
              </Button>
            </div>
          ]
        };
      }
    );

    return <div>
      <Table headRowData={{items: ['Referrer', 'Count', '']}}
             rowsData={unmappedUrlsRows}/>
      <Table headRowData={{items: ['Source', 'Medium', 'Count', '']}}
             rowsData={unmappedUtmsRows}/>
      {conditions.map((condition, index) =>
        <MappingRule key={index}
                     param={condition.param}
                     operation={condition.operation}
                     value={condition.value}
                     updateOperation={e => this.updateCondition(index, 'operation', e.value)}
                     updateParam={e => this.updateCondition(index, 'param', e.value)}
                     updateValue={e => this.updateCondition(index, 'value', e.target.value)}
                     handleAdd={this.addCondition}
                     handleDelete={() => this.deleteCondition(index)}/>
      )}
      <ChannelsSelect selected={channel}
                      ref={ref => this.channelsSelect = ref}
                      onChange={(e) => this.setState({channel: e.value})}
                      style={{width: '277px'}}/>
      <SaveButton style={{marginTop: '15px', width: 'fit-content'}}
                  onClick={() => {
                    this.setState({saveFail: false, saveSuccess: false});
                    this.setState({saveSuccess: true});
                    this.props.addRule(channel, conditions, () => {
                      this.props.updateUserMonthPlan({
                        attributionMappingRules: this.props.attributionMappingRules
                      }, this.props.region, this.props.planDate);
                    });
                  }} success={this.state.saveSuccess} fail={this.state.saveFail}/>
    </div>;
  }
};