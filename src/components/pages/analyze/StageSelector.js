import React from 'react';
import Component from 'components/Component';
import style from 'styles/analyze/stage-selector.css';

export default class StageSelector extends Component {

  style = style;

  constructor(props){
    super(props);

    this.state = {
      selected: 0
    }
  }

  render() {
    const stages = [{
      stageName: 'Leads', number: 255, previousMonth: 300
    }, {
      stageName: 'MQL', number: 10, previousMonth: 30
    }, {
      stageName: 'SQL', number: 50, previousMonth: 30
    }, {
      stageName: 'Opps', number: 10, previousMonth: 30
    }, {
      stageName: 'Customers', number: 3, previousMonth: 5
    }, {
      stageName: 'Visitors', number: 70, previousMonth: 100
    }];

    const stagesDiv = stages.map((stage, index) => {
      return <div className={this.classes.innerDiv} data-selected={(index === this.state.selected) ? true : null} data-before-selected={(index === this.state.selected - 1) ? true : null}>
        <div className={this.classes.stageName}>{stage.stageName}</div>
        <div className={this.classes.number}>{stage.number}</div>
        <div className={this.classes.stat}>{stage.previousMonth}</div>
        </div>;
    });

    return <div className={this.classes.outerDiv}>{stagesDiv}</div>;
  }
}