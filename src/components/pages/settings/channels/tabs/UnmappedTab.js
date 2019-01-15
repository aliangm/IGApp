import React from 'react';
import Component from 'components/Component';
import Table from 'components/controls/Table2';
import Button from 'components/controls/Button';
import MappingRule from 'components/pages/settings/channels/tabs/common/MappingRule';
import ChannelsSelect from 'components/common/ChannelsSelect';
import SaveButton from 'components/pages/profile/SaveButton';

export default class UnmappedTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      param: 'referrer',
      operation: 'contains',
      value: '',
      channel: ''
    };
  }

  render() {
    const {unmappedUrls} = this.props;
    const {param, operation, value, channel} = this.state;

    return <div>
      <Table
        data={unmappedUrls || []}
        columns={[
          {
            id: 'Referrer',
            header: 'Referrer',
            cell: 'referrer_url',
          },
          {
            id: 'Count',
            header: 'Count',
            cell: 'count',
          },
          {
            id: 'map',
            header: '',
            cell: (row) => (
              <div>
                <Button
                  type="primary"
                  style={{width: '102px'}}
                  onClick={() => {
                    this.setState({ value: row.referrer_url });
                    this.textfield.focus();
                  }}
                >
                  Map
                </Button>
              </div>
            )
          },
        ]}
      />
      <MappingRule param={param}
                   operation={operation}
                   value={value}
                   getRef={ref => this.textfield = ref}
                   updateOperation={e => this.setState({operation: e.value})}
                   updateParam={e => this.setState({param: e.value})}
                   updateValue={e => this.setState({value: e.target.value})}
                   withAddAndDelete={false}/>
      <ChannelsSelect selected={channel} onChange={(e) => this.setState({channel: e.value})} style={{width: '277px'}}/>
      <SaveButton style={{marginTop: '15px', width: 'fit-content'}}
                  onClick={() => {
                    this.setState({saveFail: false, saveSuccess: false});
                    this.setState({saveSuccess: true});
                    this.props.addRule(channel, {param, operation, value}, () => {
                      this.props.updateUserMonthPlan({
                        attributionMappingRules: this.props.attributionMappingRules
                      }, this.props.region, this.props.planDate);
                    });
                  }} success={this.state.saveSuccess} fail={this.state.saveFail}/>
    </div>;
  }
}