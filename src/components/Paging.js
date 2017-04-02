import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/paging.css';

export default class Paging extends Component {

  style = style

  changeMonth(monthDiff) {
    let planDate = this.props.month.split("/");
    let date = new Date(planDate[1], planDate[0]-1+monthDiff);
    let newPlanDate = (date.getMonth()+1) + '/' + date.getFullYear();
    this.props.getUserMonthPlan(newPlanDate)
  }

  render() {
    return <div className={ this.classes.titleBox }>
      <Button type="primary2" style={{
        width: '36px',
        // margin: '0 20px'
      }} onClick={() => {
        this.changeMonth(-1);
      }}>
        <div className={ this.classes.arrowLeft }/>
      </Button>
      <div className={ this.classes.titleText } style={{
        width: '200px',
        textAlign: 'center'
      }}>
        { this.props.month }
      </div>
      <Button type="primary2" style={{
        width: '36px',
        // margin: '0 20px'
      }} onClick={() => {
        this.changeMonth(1);
      }}>
        <div className={ this.classes.arrowRight }/>
      </Button>
    </div>
  }

}