import React, {PropTypes} from 'react';
import {formatChannels, getChannelIcon} from 'components/utils/channels';
import Component from 'components/Component';
import Select from 'components/controls/Select';

export default class ChannelsSelect extends Component {

  static propTypes = {
    isChannelDisabled: PropTypes.func
  };

  render() {
    const {isChannelDisabled, ...otherProps} = this.props;
    const channels = {
      select: {
        name: 'channels',
        options: formatChannels(isChannelDisabled)
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