import React from "react";
import Component from "components/Component";
import style from 'styles/dashboard/column.css';

export default class Column extends Component {

  style=style;

  render() {
    const maxHeight = 259;
    const minHeight = 29;
    const maxMargin = maxHeight - minHeight;
    const height = this.props.maxValue ? Math.max(Math.round(this.props.value * maxHeight / this.props.maxValue), minHeight) : minHeight;
    const margin = Math.min(maxHeight-height, maxMargin);
    return <div className={ this.classes.column }>
      <div className={ this.classes.tower } style={{ backgroundColor: this.props.color, height: height + 'px', marginTop: margin + 'px' }}>
        <div className={ this.classes.amount }>
          {this.props.value}
        </div>
      </div>
      <div className={ this.classes.title }>
        {this.props.title}
      </div>
    </div>
  }
}