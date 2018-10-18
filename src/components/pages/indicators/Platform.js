import React from 'react';
import Component from 'components/Component';
import style from 'styles/indicators/platform.css';
import Button from 'components/controls/Button';
import {getNickname as getIndicatorNickname} from 'components/utils/indicators';
import Loading from 'components/pages/indicators/Loading';

export default class Platform extends Component {

  style = style;

  static defaultProps = {
    loading: false
  };

  getTooltipHtml = () => {
    return this.props.indicators ?
      'Relevant metrics:<br/>' + this.props.indicators.map(getIndicatorNickname).join('<br/>')
      : null;
  };

  render() {
    return <div>
      {this.props.loading ? <Loading icon={this.props.icon}
                                     iconClass={this.props.iconClass}
                                     className={this.classes.defaultDimensions}/>
        : <div className={this.classes.square} hidden={this.props.hidden}
               data-connected={this.props.connected ? true : null}>
          <div className={this.classes.platformIcon + ' ' + this.props.iconClass} data-tip={this.getTooltipHtml()}
               data-for='platforms'
               data-icon={this.props.icon}/>
          <div className={this.classes.platformText}>
            {this.props.title}
          </div>
          <Button type="primary" className={this.classes.connectButton} onClick={this.props.open}>
            Connect
          </Button>
          <div className={this.classes.footer}>
            <div className={this.classes.checkIcon}/>
            <div>
              Connected
            </div>
            <div className={this.classes.footerButton} onClick={this.props.open}/>
          </div>
        </div>
      }
    </div>;
  }
};