import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/new-scenario-popup.css';

export default class NewScenarioPopup extends Component {

  style = style;

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} width={'572px'} contentClassName={this.classes.content}>
        <div className={this.classes.center}>
          <div className={this.classes.inner}>
            <div className={this.classes.title}>
              Create a new planning scenario
            </div>
            <div className={this.classes.subTitle}>
              How would you want to start your new scenario?
            </div>
            <div className={this.classes.boxes}>
              <div className={this.classes.scratch} onClick={() => {
              }}>
                <div className={this.classes.boxText}>
                  Start from ‘scratch’
                </div>
              </div>
              <div className={this.classes.committed} onClick={() => {
              }}>
                <div className={this.classes.boxText}>
                  Start from my committed plan
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </div>;
  }

}