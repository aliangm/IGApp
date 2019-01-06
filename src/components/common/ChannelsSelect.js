import React from 'react';
import PropTypes from 'prop-types';
import {formatChannels, getChannelIcon} from 'components/utils/channels';
import Component from 'components/Component';
import Select from 'components/controls/Select';

export default class ChannelsSelect extends Component {

  static propTypes = {
    isChannelDisabled: PropTypes.func,
    withOtherChannel: PropTypes.bool
  };

  static defaultProps = {
    withOtherChannel: false
  };

  render() {
    const {isChannelDisabled, withOtherChannel, ...otherProps} = this.props;

    const channelOptions = formatChannels(isChannelDisabled);
    if (withOtherChannel) {
      channelOptions.push({label: 'Other?', value: 'OTHER'});
    }

    const channels = {
      select: {
        name: 'channels',
        options: channelOptions
      }
    };

    return <Select
      {...otherProps}
      select={{
        menuTop: true,
        name: 'channels',
        onChange: (selected) => {
          update({
            selected: selected
          });
        },
        options: channels.select.options
      }}
      iconRendererOnValue={true}
      iconRendererOnOptions={true}
      iconFromValue={getChannelIcon}
    />;
  }
}