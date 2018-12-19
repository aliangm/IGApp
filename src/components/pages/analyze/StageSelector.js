import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/analyze/stage-selector.css';

export default class StageSelector extends Component {

  style = style;

  static propTypes = {
    selectStage: PropTypes.func,
    selectedIndex: PropTypes.number
  };

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

    const selected = this.props.selectedIndex;

    const stagesDiv = stages.map((stage, index) => {
      return <div className={this.classes.innerDiv} data-selected={(index === selected) ? true : null}
                  data-before-selected={(index === selected - 1) ? true : null}
                  data-last={(index === stages.length - 1) ? true : null}
                  onClick={() => {
                    this.props.selectStage(index);
                  }}>
        <div className={this.classes.stageName}>{stage.stageName}</div>
        <div className={this.classes.number}>{stage.number}</div>
        <div className={this.classes.stat}>{stage.previousMonth}</div>
      </div>;
    });

    return <div className={this.classes.outerDiv}>{stagesDiv}</div>;
  }
}