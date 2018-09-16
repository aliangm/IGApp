import React from 'react';
import Component from 'components/Component';
import style from 'styles/attribution/setup2.css';
import copy from 'copy-to-clipboard';
import Button from 'components/controls/Button';
import Toggle from 'components/controls/Toggle';
import Page from 'components/Page';
import {isPopupMode} from 'modules/popup-mode';
import onBoardingStyle from 'styles/onboarding/onboarding.css';
import planStyles from 'styles/plan/plan.css';

export default class Setup extends Component {

  style = style;
  styles = [onBoardingStyle, planStyles];

  constructor(props) {
    super(props);

    this.state = {
      tab: 0
    };
  }

  render() {
    const {UID: userId} = this.props.userAccount;

    const code =
      `<script type="text/javascript" async=1>
        ;(function (p, l, o, w, i, n, g) {
          if (!p[i]) {
            p.GlobalInfinigrowObject = {};
            p.GlobalInfinigrowObject.userId = '${userId}';
            p.GlobalInfinigrowObject.InfinigrowNamespace = i;
      
            p[i] = function () {
              (p[i].q = p[i].q || []).push(arguments);
            };
            p[i].q = p[i].q || [];
      
            n = l.createElement(o);
            g = l.getElementsByTagName(o)[0];
            n.async = 1;
            n.src = w;
            g.parentNode.insertBefore(n, g);
          }
        }(window, document, 'script', "//ddzuuyx7zj81k.cloudfront.net/1.0.0/attributionSnippet.js", 'infinigrow'));
      </script>`;

    const renderStep = (stepNumber, stepTitle, stepSubTitle, stepContent) => {
      return <div className={this.classes.step}>
        <div className={this.classes.stepHead}>
          <div className={this.classes.stepNumberWrapper}>
            <div className={this.classes.stepNumber}>{stepNumber}</div>
          </div>
          <div className={this.classes.titleWrapper}>
            <div className={this.classes.contentTitle}>{stepTitle}</div>
            {stepSubTitle ? <div className={this.classes.contentSubTitle}>{stepSubTitle}</div> : null}
          </div>
        </div>
        <div className={this.classes.stepContent}>
          {stepContent}
        </div>
      </div>;
    };

    return <Page popup={isPopupMode()}
                 className={!isPopupMode() ? this.classes.static : null}
                 contentClassName={onBoardingStyle.locals.content}
                 innerClassName={onBoardingStyle.locals.pageInner}
                 width='100%'>
      <div className={this.classes.head}>
        <div className={planStyles.locals.headTitle}>Attribution</div>
      </div>
      <div className={this.classes.title}>Add the tracking script to your website</div>
      <div className={this.classes.subTitle}>Setting up InfiniGrow’s tracking is easy and takes about a minute. This is
        the first and last time you'll be asked to use code.
      </div>
      {
        renderStep(1, 'Copy your code', 'or get it sent by email with a step-by-step guide',
          <div className={this.classes.snippetBox}>
            <div className={this.classes.snippetWrapper}>
              <pre className={this.classes.snippet}>
              {code}
              </pre>
            </div>
            <div className={this.classes.buttons}>
              <Button type='secondary' className={this.classes.secondaryButton}>
                Email this script and instructions
              </Button>
              <Button type='primary' icon="buttons:edit"
                      className={this.classes.rightButton}
                      onClick={() => copy(code)}>
                Copy
              </Button>
            </div>
          </div>)
      }
      {
        renderStep(2, 'Add it to your website', null, <div>
          <Toggle options={
            [{
              text: 'HTML',
              value: 0
            },
              {
                text: 'Google Tag Manager',
                value: 1
              },
              {
                text: 'Word Press',
                value: 2
              }]}
                  selectedValue={this.state.tab}
                  style={{width: '345px', justifyContent: 'left'}}
                  onClick={(value) => {
                    this.setState({tab: value});
                  }}
          >
          </Toggle>
          <div className={this.classes.secondStepText}>
            {'Place the script into the head (before the </head> tag) of every page of your site (or site template).'}
          </div>
          <Button type='secondary'
                  className={this.classes.secondaryButton}>
            Read the step-by-step guide
          </Button>
        </div>)
      }
    </Page>;
  }
}