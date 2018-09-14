import React from 'react';
import Component from 'components/Component';
import Tabs from 'components/onboarding/Tabs';
import style from 'styles/attribution/setup2.css';
import copy from 'copy-to-clipboard';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';
import Select from 'components/controls/Select';
import Button from 'components/controls/Button';
import Toggle from 'components/controls/Toggle';

export default class Setup extends Component {

  code = (userId) => `<script type="text/javascript" async=1>
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

  style = style;

  render() {
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

    return <div className={this.classes.page}>
      {
        renderStep(1, 'Copy your code', 'or get it sent by email with a step-by-step guide',
          <div className={this.classes.snippetBox}>
            <div className={this.classes.snippetWrapper}>
              <pre className={this.classes.snippet}>
              {this.code('#userId#')}
              </pre>
            </div>
            <div className={this.classes.buttons}>
              <Button type='secondary' className={this.classes.leftButton} contClassName={this.classes.buttonContent}>Email
                this script and instructions</Button>
              <Button type='primary' icon="buttons:edit" className={this.classes.rightButton}
                      contClassName={this.classes.buttonContent}>Copy</Button>
            </div>
          </div>)
      }
      {
        renderStep(2, 'Add it to your website', null, <div>
          <Toggle options={
            [{
              text: 'HTML',
              value: 'html'
            },
              {
                text: 'Google Tag Manager',
                value: 'tag manager'
              },
              {
                text: 'Word Press',
                value: 'word press'
              }]}
                  selectedValue="html"
                  style = {{width: "345px"}}
          >
          </Toggle>
          <div className={this.classes.secondStepText}>
            {'Place the script into the head (before the </head> tag) of every page of your site (or site template).'}
          </div>
          <Button type='secondary'
                  className={this.classes.secondStepButton}
                  contClassName={this.classes.buttonContent}>
            Read the step-by-step guide
          </Button>
        </div>)
      }
    </div>;
  }
}