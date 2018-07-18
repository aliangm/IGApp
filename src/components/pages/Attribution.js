import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/plan/plan.css';
import UploadOfflinePopup from 'components/pages/attribution/UploadOfflinePopup';
import {FeatureToggle} from 'react-feature-toggles';
import FirstPageVisit from 'components/pages/FirstPageVisit';
import Button from 'components/controls/Button';

export default class Attribution extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      showOfflinePopup: false
    };
  }

  selectTab(index) {
    this.setState({
      selectedTab: index
    });
  }

  render() {

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, this.props));
    return <FeatureToggle featureName="attribution">
      <div>
        <Page contentClassName={this.classes.content}
              innerClassName={this.classes.pageInner}
              className={this.classes.static}
              width="100%">
          <div className={this.classes.head}>
            <div className={this.classes.headTitle}>Attribution</div>
            <div className={this.classes.headPlan}>
              {this.state.selectedTab !== 3 ? null :
                <Button type="primary2"
                        style={{width: '102px'}}
                        selected={this.state.showOfflinePopup ? true : null}
                        onClick={() => {
                          this.setState({showOfflinePopup: true});
                        }}>
                  Upload
                </Button>
              }
            </div>
          </div>
          {this.props.userAccount.pages && this.props.userAccount.pages.attribution ?
            <div className={this.classes.wrap}>
              {childrenWithProps}
              <div hidden={!this.state.showOfflinePopup}>
                <UploadOfflinePopup
                  close={() => {
                    this.setState({showOfflinePopup: false});
                  }}
                  setDataAsState={this.props.setDataAsState}/>
              </div>
            </div>
            :
            <FirstPageVisit
              title="Understanding data starts by collecting it"
              content="You can learn and improve a lot from your data. Track leads’ and users’ interactions with your brand to better understand your investments' effectiveness."
              action="Implement Attribution >"
              icon="step:attribution"
              onClick={() => {
                this.props.updateUserAccount({'pages.attribution': true});
              }}
            />
          }
        </Page>
      </div>
    </FeatureToggle>;
  }
}