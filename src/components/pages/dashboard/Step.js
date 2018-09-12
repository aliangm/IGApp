import React from 'react';
import Component from 'components/Component';
import style from 'styles/dashboard/step.css';
import Button from 'components/controls/Button';

export default class Step extends Component {

  style = style;

  render() {
    return <div className={this.classes.box}>
      <div>
        <div className={this.classes.center}>
          <div className={this.classes.icon} data-icon={this.props.icon}/>
        </div>
        <div className={this.classes.title}>
          {this.props.title}
        </div>
        <div className={this.classes.text}>
          {this.props.text}
        </div>
      </div>
      <div>
        {
          this.props.done
            ?
            <div className={this.classes.center}>
              <div className={this.classes.done}/>
            </div>
            :
            <div className={this.classes.center}>
              <Button type="primary"
                      style={{ width: 'auto', alignSelf: 'center' }}
                      contClassName={this.classes.button}
                      onClick={this.props.onClick}>
                {this.props.action}
              </Button>
            </div>
        }
      </div>
    </div>
  }
}