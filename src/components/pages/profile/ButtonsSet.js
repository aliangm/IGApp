import React from 'react';
import Component from 'components/Component';

import Label from 'components/ControlsLabel';
import Popup from 'components/Popup';
import ChooseButton from 'components/pages/profile/ChooseButton';
import NotSure from 'components/onboarding/NotSure';

import style from 'styles/profile/buttons-set.css';

export default class ButtonsSet extends Component {
  style = style;

  constructor(props) {
    super(props);
    this.state = {
      selectedButton: props.selectedKey || 0,
      popupHidden: true
    };
  }
  componentWillReceiveProps(nextProps){
    nextProps.buttons.map((params, i) => {
      console.log(nextProps.selectedKey, params.key, i);
      if (nextProps.selectedKey == params.key){
        console.log(params.text)
        this.state.selectedButton = params.key;
      }
    });
  }

  renderItem = ({ selected, key, params, onClick }) => {
    return <ChooseButton
      key={ key }
      selected={ selected }
      text={ params.text }
      icon={ params.icon }
      onClick={ onClick }
    />;
  }

  render() {
    let selectedIndex = 0;
    const renderItem = this.props.renderItem || this.renderItem;
    const buttons = this.props.buttons.map((params, i) => {
      const key = params.key || i;
    
      return renderItem({
        selected: key === this.state.selectedButton,
        key: key,
        params: params,
        onClick: () => {
          this.setState({
            selectedButton: key
          });

          if (this.props.onChange) {
            this.props.onChange(key);
          }
        }
      });
    });
    
    let help;

    if (this.props.help) {
      help = <div className={ this.classes.helpWrap }>
        <NotSure onClick={ this.onPopup } />
        { this.getPopup() }
      </div>
    }

    return <div className={ this.classes.box }>
      <div className={ this.classes.inner }>
        { buttons }
        { help }
      </div>
    </div>
  }

  hidePopup() {
    this.setState({
      popupHidden: true
    });
  }

  selectButton = (index) => {
    if (index < 0) {
      index = this.props.buttons.length - 1;
    } else if (index >= this.props.buttons.length) {
      index = 0;
    }

    this.setState({
      selectedButton: index
    });
  }

  selectNextButton = () => {
    this.selectButton(this.state.selectedButton + 1);
  }

  selectPrevButton = () => {
    this.selectButton(this.state.selectedButton - 1);
  }

  getPopup() {
    this.popup = <Popup style={{
      width: '318px',
      top: '50%',
      transform: 'translate(0, -50%)'
    }} hidden={ this.state.popupHidden } onClose={() => {
      this.setState({
        popupHidden: true
      });
    }}>
      { this.props.popup }
    </Popup>

    return this.popup;
  }

  onPopup = () => {
    this.setState({
      popupHidden: false
    });
  }
}