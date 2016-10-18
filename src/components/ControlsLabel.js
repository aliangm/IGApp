import React from 'react';
import Component from 'components/Component';

import style from 'styles/controls-label.css';

export default class Label extends Component {
  style = style;
  state = {
    displayHelp: false
  };

  render() {
    let question;
    let tooltip;

    if (this.state.displayHelp) {
      let items = this.props.question;

      if (!Array.isArray(items)) {
        items = [];
      }

      const contents = items.map(name => {
        return <div key={ name }>
          <div className={ this.classes.ttSubTitle }>{ name }</div>
          <div className={ this.classes.ttSubText }>
            Here goes some description
          </div>
        </div>
      });

      tooltip = <div className={ this.classes.tooltip }>
        <div className={ this.classes.ttLabel }>
          { this.props.children }
        </div>
        <div className={ this.classes.ttContent }>
          { contents }
        </div>
      </div>
    }

    if (this.props.question) {
      question = <div className={ this.classes.questionBox }>
        <div className={ this.classes.question }
          onMouseOver={() => {
            this.setState({
              displayHelp: true
            })
          }}
          onMouseOut={() => {
            this.setState({
              displayHelp: false
            })
          }}
        />

        { tooltip }
      </div>
    }

    let className = this.classes.label;

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    return <div className={ className } style={ this.props.style }>
      { this.props.children }
      { question }
    </div>
  }
}

