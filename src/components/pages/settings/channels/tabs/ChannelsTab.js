import React from 'react';
import Component from 'components/Component';
import style from 'styles/settings/channels/channels-tab.css';
import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import {getChannelIcon, getChannelsWithProps, getNickname as getChannelNickname} from 'components/utils/channels';
import {groupBy, sortBy, uniq} from 'lodash';
import SaveButton from 'components/pages/profile/SaveButton';

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
      this.props.updateUserMonthPlan({userChannelsSchema: this.props.userChannelsSchema}, this.props.region, this.props.planDate);
      this.setState({
        categoryEdit: undefined,
        channelEdit: undefined,
        selectedChannel: channel,
        selectedCategory: category
      });
    });
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
          <SaveButton onClick={() => {
            this.setState({saveFail: false, saveSuccess: false});
            this.setState({saveSuccess: true});
            this.editChannel(channelEdit, categoryEdit, selectedChannel);
          }} success={this.state.saveSuccess} fail={this.state.saveFail}/>
        </div>
      </div>
    </div>;
  }
}