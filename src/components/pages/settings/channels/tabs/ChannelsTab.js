import React from 'react';
import Component from 'components/Component';
import style from 'styles/settings/channels/channels-tab.css';
import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import {getChannelIcon, getChannelsWithProps, getNickname as getChannelNickname} from 'components/utils/channels';
import {groupBy, sortBy, uniq} from 'lodash';
import SaveButton from 'components/pages/profile/SaveButton';
import Button from 'components/controls/Button';

const paramsOptions = [
  {value: 'source', label: 'source'},
  {value: 'medium', label: 'medium'},
  {value: 'referrer', label: 'referrer'}
];

const operationOptions = [
  {value: 'equals', label: 'equals'},
  {value: 'contains', label: 'contains'}
];

export default class ChannelsTab extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {};
  }

  editChannel = (name, category, channel) => {
    const userChannelsSchema = {...this.props.userChannelsSchema};
    if (!userChannelsSchema[channel]) {
      userChannelsSchema[channel] = {};
    }
    userChannelsSchema[channel].nickname = name;
    userChannelsSchema[channel].category = category;

    this.props.updateState({userChannelsSchema: userChannelsSchema}, () => {
      this.props.updateUserMonthPlan({
        userChannelsSchema: this.props.userChannelsSchema,
        attributionMappingRules: this.props.attributionMappingRules
      }, this.props.region, this.props.planDate);
      this.setState({
        categoryEdit: undefined,
        channelEdit: undefined,
        selectedChannel: channel,
        selectedCategory: category
      });
    });
  };

  getNewCondition = () => {
    return {
      param: '',
      operation: '',
      value: ''
    };
  };

  addRule = (channel) => {
    const {attributionMappingRules} = this.props;
    attributionMappingRules.push({
      conditions: [
        {...this.getNewCondition()}
      ],
      channel
    });
    this.props.updateState({attributionMappingRules});
  };

  updateRule = (ruleIndex, conditionIndex, key, value) => {
    const {attributionMappingRules} = this.props;
    attributionMappingRules[ruleIndex].conditions[conditionIndex][key] = value;
    this.props.updateState({attributionMappingRules});
  };

  deleteCondition = (ruleIndex, conditionIndex) => {
    const {attributionMappingRules} = this.props;
    delete attributionMappingRules[ruleIndex].conditions[conditionIndex];

    // If last condition, delete rule
    if (attributionMappingRules[ruleIndex].conditions.length === 0) {
      delete attributionMappingRules[ruleIndex];
    }

    this.props.updateState({attributionMappingRules});
  };

  addCondition = (ruleIndex) => {
    const {attributionMappingRules} = this.props;
    delete attributionMappingRules[ruleIndex].conditions.push({...this.getNewCondition()});

    this.props.updateState({attributionMappingRules});
  };

  render() {
    const channelsWithProps = getChannelsWithProps();
    const propsArray = Object.keys(channelsWithProps).map(channel => {
      return {
        channel,
        ...channelsWithProps[channel]
      };
    });
    const channelsByCategory = groupBy(sortBy(propsArray, ['nickname']), 'category');
    const categories = uniq(Object.keys(channelsByCategory)).sort();
    const categoriesOptions = categories.map(category => {
      return {
        value: category,
        label: category
      };
    });

    const getDefaultChannel = category => channelsByCategory[category][0].channel;

    const {selectedCategory = categories[0], selectedChannel = getDefaultChannel(selectedCategory), channelEdit = getChannelNickname(selectedChannel), categoryEdit = selectedCategory} = this.state;
    const {attributionMappingRules} = this.props;
    const channelRules = attributionMappingRules
      .map((rule, index) => {
        return {
          ...rule,
          index
        };
      })
      .filter(rule => rule.channel === selectedChannel);

    return <div>
      <div style={{display: 'flex'}}>
        <div className={this.classes.categoriesMenu}>
          {
            categories.map(category =>
              <div className={this.classes.categoryBox}
                   key={category}
                   data-selected={category === selectedCategory ? true : null}
                   onClick={() => {
                     this.setState({selectedCategory: category, selectedChannel: getDefaultChannel(category)});
                   }}>
                {category}
              </div>)
          }
        </div>
        <div className={this.classes.channelsMenu}>
          {
            channelsByCategory[selectedCategory].map(item =>
              <div className={this.classes.channelBox}
                   key={item.channel}
                   data-selected={selectedChannel === item.channel ? true : null}
                   onClick={() => {
                     this.setState({selectedChannel: item.channel});
                   }}>
                <div className={this.classes.channelIcon} data-icon={getChannelIcon(item.channel)}/>
                {item.nickname}
              </div>)
          }
        </div>
        <div className={this.classes.inner}>
          <div className={this.classes.category}>
            {selectedCategory}
          </div>
          <div className={this.classes.channel}>
            <div className={this.classes.channelIcon} data-icon={getChannelIcon(selectedChannel)}/>
            {getChannelNickname(selectedChannel)}
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Name
            </div>
            <Textfield value={channelEdit}
                       onChange={e => {
                         this.setState({channelEdit: e.target.value});
                       }}/>
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Category
            </div>
            <Select select={{options: categoriesOptions}} style={{width: '131px'}}
                    selected={categoryEdit}
                    onChange={e => {
                      this.setState({categoryEdit: e.value});
                    }}/>
          </div>
          <div>
            <div className={this.classes.titleText} style={{marginTop: '30px'}}>
              Mapping
            </div>
            {
              channelRules.map(rule =>
                <div key={rule.index}>
                  {
                    rule.conditions.map((condition, conditionIndex) =>
                      <div className={this.classes.flexRow} key={`${rule.index}-${conditionIndex}`}>
                        <Select select={{options: paramsOptions}} style={{width: '131px', marginRight: '15px'}}
                                selected={condition.param}
                                onChange={e => {
                                  this.updateRule(rule.index, conditionIndex, 'param', e.value);
                                }}/>
                        <Select select={{options: operationOptions}} style={{width: '131px', marginRight: '15px'}}
                                selected={condition.operation}
                                onChange={e => {
                                  this.updateRule(rule.index, conditionIndex, 'operation', e.value);
                                }}/>
                        <Textfield value={condition.value}
                                   style={{marginRight: '15px'}}
                                   onChange={e => {
                                     this.updateRule(rule.index, conditionIndex, 'value', e.target.value);
                                   }}/>
                        <div className={this.classes.rowIcons}>
                          <div className={this.classes.minusIcon}
                               onClick={() => this.deleteCondition(rule.index, conditionIndex)}/>
                          <div className={this.classes.plusIcon} onClick={() => this.addCondition(rule.index)}/>
                        </div>
                      </div>)
                  }
                  <div className={this.classes.text} hidden={rule.index === channelRules.length - 1}>
                    OR
                  </div>
                </div>)
            }
            <Button type="secondary" style={{width: 'fit-content', marginTop: '15px'}}
                    onClick={() => this.addRule(selectedChannel)}>
              Or
            </Button>
          </div>
          <SaveButton style={{marginTop: '15px', width: 'fit-content'}}
                      onClick={() => {
                        this.setState({saveFail: false, saveSuccess: false});
                        this.setState({saveSuccess: true});
                        this.editChannel(channelEdit, categoryEdit, selectedChannel);
                      }} success={this.state.saveSuccess} fail={this.state.saveFail}/>
        </div>
      </div>
    </div>;
  }
}