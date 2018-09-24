import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/paging.css';
import serverCommunication from 'data/serverCommunication';
import history from 'history';
import { formatDate } from 'components/utils/date';

export default class Paging extends Component {

  style = style

  changeMonth(monthDiff) {
    let planDate = this.props.month.split("/");
    let date = new Date(planDate[1], planDate[0]-1+monthDiff);
    let newPlanDate = (date.getMonth()+1) + '/' + date.getFullYear();
    this.getUserMonthPlan(this.props.region ,newPlanDate)
  }

  getUserMonthPlan(region, planDate) {
    serverCommunication.serverRequest('GET', 'usermonthplan', null, region, planDate)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (data) {
               this.props.pagingUpdateState(data);
              }
            })
        }
        else if (response.status == 401){
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return <div className={ this.classes.titleBox }>
      <Button type="primary" style={{
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
        { formatDate(this.props.month) }
      </div>
      <Button type="primary" style={{
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