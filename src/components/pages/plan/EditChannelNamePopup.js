import React from 'react';
import Component from 'components/Component';
import style from 'styles/profile/product-launch-popup.css';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import { getTitle, getNickname, formatFatherChannels } from 'components/utils/channels';
import Label from 'components/ControlsLabel';
import Select from 'components/controls/Select';

export default class EditChannelNamePopup extends Component {
  style = style;

  static defaultProps = {
    channel: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      shortName: '',
      longName: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.channel !== this.props.channel) && nextProps.channel) {
      this.setState({
        longName: getTitle(nextProps.channel),
        shortName: getNickname(nextProps.channel)
      });
    }
  }

  handleChange(event) {
    const newName = event.target.value;
    const hierarchy = this.state.longName.substring(0, this.state.longName.lastIndexOf('/'));
    this.setState({
      longName: hierarchy + ' / ' + newName
    })
  }

  handleChangeHierarchy(event) {
    const channel = this.state.longName.substring(this.state.longName.lastIndexOf('/') + 2);
    const hierarchy = event.value;
    this.setState({
      longName: hierarchy + ' / ' + channel
    })
  }

  render() {
    const $ = this.classes;
    let style;

    if (this.props.hidden) {
      style = { display: 'none' };
    }

    return <div className={ $.box } style={ style }>
      <div className={ $.choose }>
        Define how you like to see this channel
      </div>

      <div className={ $.choose }>
        <Label style={{width: '100px', marginTop: '8px', marginRight: '20px' }}>Channel Name</Label>
        <Textfield
          value={ this.state.longName.substring(this.state.longName.lastIndexOf('/')+2) }
          onChange={ this.handleChange.bind(this) }
          style={{ width: '230px' }}
        />
      </div>
      <div className={ $.choose }>
        <Label style={{width: '100px', marginTop: '8px', marginRight: '20px' }}>Nickname</Label>
        <Textfield
          value={ this.state.shortName }
          onChange={ (e)=> {this.setState({shortName: e.target.value})} }
          style={{ width: '230px' }}
        />
      </div>
      <div className={ $.choose }>
        <Label style={{width: '100px', marginTop: '8px', marginRight: '20px' }}>Category</Label>
        <Select
          style={{ width: '230px' }}
          selected={ this.state.longName.substring(0, this.state.longName.lastIndexOf('/') -1) }
          select={{
            options: formatFatherChannels()
          }}
          onChange={ this.handleChangeHierarchy.bind(this) }
        />
      </div>
      <div className={ $.nav }>
        <Button type="normal-accent" style={{
          width: '100px',
          marginRight: '20px'
        }} onClick={ this.props.onBack }>
          Cancel
        </Button>
        <Button type="accent" style={{
          width: '100px'
        }} onClick={ ()=> {this.props.onNext(this.state.longName, this.state.shortName, this.props.channel) }}>
          Save
        </Button>
      </div>
    </div>
  }
}