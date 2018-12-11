import React from 'react';
import Component from 'components/Component';
import style from 'styles/settings/channels/channels-tab.css';
import Label from 'components/ControlsLabel';
import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';

export default class ChannelsTab extends Component {

  style = style;

  render() {
    return <div>
      <div style={{display: 'flex'}}>
        <div className={this.classes.categoriesMenu}>
          <div className={this.classes.categoryBox}>
            Social
          </div>
          <div className={this.classes.categoryBox} data-selected={true}>
            Social
          </div>
          <div className={this.classes.categoryBox}>
            Social
          </div>
        </div>
        <div className={this.classes.channelsMenu}>
          <div className={this.classes.channelBox}>
            <div className={this.classes.channelIcon} data-icon="plan:other"/>
            SEO
          </div>
          <div className={this.classes.channelBox} data-selected={true}>
            <div className={this.classes.channelIcon} data-icon="plan:other"/>
            Twitter Paid
          </div>
          <div className={this.classes.channelBox}>
            <div className={this.classes.channelIcon} data-icon="plan:other"/>
            Webinar
          </div>
        </div>
        <div className={this.classes.inner}>
          <div className={this.classes.category}>
            Social - Paid
          </div>
          <div className={this.classes.channel}>
            <div className={this.classes.channelIcon} data-icon="plan:other"/>
            Twitter - Paid
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Name
            </div>
            <Textfield value={''} onChange={() => {
            }}/>
          </div>
          <div className={this.classes.flexRow}>
            <div className={this.classes.fieldText}>
              Category
            </div>
            <Select style={{width: '131px'}} selected={''} onChange={() => {
            }}/>
          </div>
        </div>
      </div>
    </div>;
  }
}