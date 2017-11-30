import React from 'react';
import Component from 'components/Component';
import style from 'styles/preferences/objective-view.css';
import { getNickname } from 'components/utils/indicators';

export default class ObjectiveView extends Component {

  style = style;

  getDaysLeft() {
    const targetDate = new Date(this.props.timeFrame);
    const today = new Date();
    return Math.max(Math.ceil((targetDate.getTime() - today.getTime())/(24*60*60*1000)), 0) + " days left";
  }

  isObjectiveActive() {
    // If the objective achieved, show green.
    // Else, if date passed - red.
    // Else - none.
    const today = new Date();
    const date = new Date(this.props.timeFrame);
    if (this.props.target <= this.props.value) {
      return 'success';
    }
    if (date < today) {
      return 'fail'
    }
    return null;
  }

  render() {
    const colors = [
      { start: '#1991eb', end: '#2da1f8'},
      { start: '#9d90e4', end: '#8261e6'},
      { start: '#2bb415', end: '#5ad946'},
      { start: '#fdc018', end: '#f8cf5d'}
    ];
    return <div>
      <div className={ this.classes.row }>
        <div className={ this.classes.start }>
          <div className={ this.classes.index }>
            { "#" + (this.props.index + 1) }
          </div>
          <div className={ this.classes.nickname }>
            { getNickname(this.props.indicator) }
          </div>
        </div>
        <div className={ this.classes.end }>
          <div className={ this.classes.textValue }>
            { (this.props.value || 0) + " / " }
          </div>
          <div className={ this.classes.target }>
            { this.props.target }
          </div>
          <div className={ this.classes.textButton } style={{ marginLeft: '20px' }} onClick={ this.props.editObjective }>
            Edit
          </div>
          <div className={ this.classes.textButton } onClick={ this.props.deleteObjective }>
            Delete
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <div className={ this.classes.pipe }>
          <div className={ this.classes.pipeFill } style={{
            width: (Math.min(1, this.props.value / this.props.target) * 360) + 'px',
            backgroundImage: 'linear-gradient(to top,' +  colors[this.props.index % colors.length].start + ', ' + colors[this.props.index % colors.length].end + ')'
          }}/>
        </div>
        <div className={ this.classes.timeLeft }>
          { this.getDaysLeft() }
        </div>
      </div>
      <div className={this.classes.objectiveIcon} data-active={this.isObjectiveActive()}/>
    </div>
  }

}