import React from 'react';
import Component from 'components/Component';
import style from 'styles/settings/channels/channels-tab.css';
import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import {getChannelIcon, getChannelsWithProps, getNickname as getChannelNickname} from 'components/utils/channels';
import {groupBy, uniq} from 'lodash';

export default class ChannelsTab extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const channelsWithProps = getChannelsWithProps();
    const propsArray = Object.keys(channelsWithProps).map(channel => {
      return {
        channel,
        ...channelsWithProps[channel]
      };
    });
    const channelsByCategory = groupBy(propsArray, 'category');
    const categories = uniq(Object.keys(channelsByCategory));
    const categoriesOptions = categories.map(category => {
      return {
        value: category,
        label: category
      };
    });

    const getDefaultChannel = category => channelsByCategory[category][0].channel;

    const {selectedCategory = categories[0], selectedChannel = getDefaultChannel(selectedCategory)} = this.state;
    const channelNickname = getChannelNickname(selectedChannel);
    const channelIcon = getChannelIcon(selectedChannel);
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
                <div className={this.classes.channelIcon} data-icon={channelIcon}/>
                {item.nickname}
              </div>)
          }
        </div>
        <div className={this.classes.inner}>
          <div className={this.classes.category}>
            {selectedCategory}
          </div>
          <div className={this.classes.channel}>
            <div className={this.classes.channelIcon} data-icon={channelIcon}/>
            {channelNickname}
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Name
            </div>
            <Textfield value={channelNickname} onChange={() => {
            }}/>
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Category
            </div>
            <Select select={{options: categoriesOptions}} style={{width: '131px'}} selected={selectedCategory}
                    onChange={() => {
                    }}/>
          </div>
        </div>
      </div>
    </div>;
  }
}