import React from 'react';
import Component from 'components/Component';
import style from 'styles/profile/product-launch-popup.css';
import Button from 'components/controls/Button';
import Textfield from 'components/controls/Textfield';
import { getTitle, getNickname} from 'components/utils/channels';

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

  render() {
    const $ = this.classes;
    let style;

    if (this.props.hidden) {
      style = { display: 'none' };
    }

    return <div className={ $.box } style={ style }>
      <div className={ $.choose }>
        Select a long and short name customized for you
      </div>

      <div className={ $.choose }>
        <Textfield
          value={ this.state.longName }
          onChange={ (e)=> {this.setState({longName: e.target.value})} }
        />
      </div>
      <div className={ $.choose }>
        <Textfield
          value={ this.state.shortName }
          onChange={ (e)=> {this.setState({shortName: e.target.value})} }
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