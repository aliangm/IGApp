import React from 'react';
import Component from 'components/Component';
import names from 'classnames';

import style from 'styles/indicators/item.css';
import icons from 'styles/icons/indicators.css';

import Popup from 'components/Popup';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';

export default class Item extends Component {
  style = style;
  styles = [icons]

  constructor(props) {
    super(props);

    this.state = {
      state: props.defaultState,
      status: props.defaultStatus || '',
      menuShown: false,
      statusPopupHidden: true
    };
  }

  getStateText() {
    switch (this.state.state) {
      case 'auto': return 'Automatic';
      case 'manual': return 'Manual';
      case 'inactive': return 'Inactive';

      default: return 'Undefined';
    }
  }

  getStatusProgress() {
    const percents = this.state.status.match(/^(\d+)%$/);

    if (percents) {
      return +percents[1];
    } else {
      return parseInt(this.state.status/100) || 0;
    }
  }

  getStatusText() {
    const status = this.state.status;

    if (!status) {
      return '\u00A0';
    }

    if (isFinite(status)) {
      return status;
    }

    return status;
  }

  needProgress() {
    if (this.state.state === 'manual' || this.state.state === 'auto') {
      return true;
    }

    return false;
  }

  selectState = (state) => {
    this.setState({
      state: state,
      menuShown: false,
      status: ''
    });
  }

  showMenu = () => {
    this.setState({
      menuShown: true
    });
  }

  useStatus = () => {
    const status = this.refs.statusText.getValue();

    this.setState({
      status: status,
      statusPopupHidden: true
    });
  }

  showSocialPopup = () => {
    const url = require('assets/social-popup.png');
    const win = window.open('about:blank', 'social_popup', 'width=700,height=290');

    win.document.open();
    win.document.write(`
      <style>
        html, body {
          margin: 0;
          height: 100%;
        }
      </style>
      <base href="${ document.baseURI }">
      <img src="${ url }" width="700">
    `);
    win.document.close();

    win.document.querySelector('img').onclick = (e) => {
      this.setState({
        status: '1500'
      });

      e.target.onclick = null;
      win.close();
    };
  }

  render() {
    return <div className={ this.classes.item } data-state={ this.state.state }>
      <div className={ this.classes.inner }>
        <div className={ this.classes.head }>{ this.props.title }</div>
        <div className={ this.classes.content }>
          <div className={ this.classes.iconWrap }>
            { this.needProgress() ?
              <ProgressCircle progress={ this.getStatusProgress() } />
            : null }
            <div className={ this.classes.icon } data-icon={ this.props.icon } />
          </div>
          { this.state.state ?
            <div className={ this.classes.status }>{ this.getStatusText() }</div>
          : null }
        </div>
        <div className={ this.classes.footer }>
          <div className={ this.classes.footerButton } onClick={ this.showMenu } />
          <div className={ this.classes.footerState }>{ this.getStateText() }</div>
        </div>

        <div className={ this.classes.menu } hidden={ !this.state.menuShown }>
          <div className={ this.classes.menuItem } onClick={() => {
            this.selectState('auto');
            this.showSocialPopup();
          }}>
            Automatic
          </div>
          <div className={ this.classes.menuItem } onClick={() => {
            this.selectState('manual');
            this.setState({
              statusPopupHidden: false
            });

            setTimeout(() => {
              this.refs.statusText.focus();
            }, 1);
          }}>
            Manual
          </div>
          <div className={ this.classes.menuItem } onClick={() => {
            this.selectState('inactive');
          }}>
            Inactive
          </div>
        </div>
      </div>

      <Popup
        className={ this.classes.statusPopup }
        hidden={ this.state.statusPopupHidden }
      >
        <div className={ this.classes.statusPopupRow }>
          <div className={ this.classes.statusPopupTitle }>
            Indicator current status
          </div>
        </div>
        <div className={ this.classes.statusPopupRow }>
          <Textfield onChange={() => {}} ref="statusText" />
        </div>
        <div className={ this.classes.statusPopupRow }>
          <div className={ this.classes.statusButtons }>
            <Button type="pure" style={{
              paddingLeft: '0'
            }} onClick={() => {
              this.setState({
                statusPopupHidden: true
              });
            }}>Cancel</Button>
            <Button type="accent2" style={{
              width: '80px',
              textTransform: 'uppercase'
            }} onClick={ this.useStatus }>Done</Button>
          </div>
        </div>
      </Popup>
    </div>
  }
}

class ProgressCircle extends Component {
  style = style;

  static defaultProps = {
    progress: 0
  }

  _RADIUS = 47;
  _FULL_CIRCLE = this._RADIUS * Math.PI * 2;

  getOffset() {
    let offset = this.props.progress;
    offset = Math.min(Math.max(offset, 0), 100);

    const circle = Math.PI * 2 * (offset / 100 + 1) * this._RADIUS;
    return -circle;
  }

  render() {
    return <div className={ this.classes.progressBox }>
      <svg className={ this.classes.progressSvg } viewBox="0 0 100 100">
        <circle r={ this._RADIUS } cx="50" cy="50"
          className={ this.classes.progressCircleBack }
          fill="transparent"
          strokeDasharray={ this._FULL_CIRCLE }
          strokeDashoffset={ 0 }
        ></circle>
        <circle r={ this._RADIUS } cx="50" cy="50"
          className={ this.classes.progressCircle }
          fill="transparent"
          strokeDasharray={ this._FULL_CIRCLE }
          strokeDashoffset={ this.getOffset() }
        ></circle>

        {/*<path d="M3,50a47,47 0 1,0 94,0a47,47 0 1,0 -94,0"
          className={ this.classes.progressCircle }
          fill="transparent"
          strokeDasharray={ this._FULL_CIRCLE }
          strokeDashoffset={ this.getOffset() }
        />*/}
      </svg>
    </div>
  }
}