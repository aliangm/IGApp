import React from 'react';
import Component from 'components/Component';
import style from 'styles/first-page-visit.css';
import Button from 'components/controls/Button';
import stepStyle from 'styles/dashboard/step.css';

export default class FirstPageVisit extends Component {

  style = style;
  styles = [stepStyle];

  render () {
    return <div className={this.classes.inner}>
      <div style={{ alignSelf: 'center' }}>
        <div className={this.classes.icon} data-icon={this.props.icon}/>
      </div>
      <div style={{ marginLeft: '35px' }}>
        <div className={this.classes.title}>
          {this.props.title}
        </div>
        <div className={this.classes.content}>
          {this.props.content}
        </div>
        <Button type="primary"
                style={{ width: 'max-content' }}
                contClassName={this.classes.button}
                onClick={this.props.onClick}>
          {this.props.action}
        </Button>
      </div>
    </div>
  }
}