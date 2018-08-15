import Component from 'components/Component';
import Page from 'components/Page';
import React, {PropTypes} from 'react';
import ChatBot from 'react-simple-chatbot';
import style from 'styles/plan/plan-optimization-popup.css';
import ConstraintStep from 'components/pages/plan/ConstraintStep';

const steps = [
  {
    id: '0',
    message: 'Hey there!\nLooking to improve your plan?',
    trigger: '1'
  },
  {
    id: '1',
    options: [
      {value: 1, label: 'No.', trigger: '2'},
      {value: 2, label: 'Sure!', trigger: '3'}
    ]
  },
  {
    id: '2',
    message: 'Great!',
    end: true
  },
  {
    id: '3',
    message: 'That’s great :)\n' +
      'Do you have specific requirements for the reallocation suggestion?',
    trigger: '4'
  },
  {
    id: '4',
    options: [
      {value: 1, label: 'No, I want the optimal suggestion', trigger: '5'},
      {
        value: 2,
        label: 'yes, I want to limit the number of channels that will be touched in the suggestion',
        trigger: '6'
      }
    ]
  },
  {
    id: '5',
    message: 'ok optimal suggestion',
    end: true
  },
  {
    id: '6',
    component: <ConstraintStep/>
  },
  {
    id: '7',
    message: `channels limit is: {previousValue}`,
    end: true
  }
];

export default class AddObjectivePopup extends Component {

  style = style;

  static propTypes = {
    hidden: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} width='650px' contentClassName={this.classes.content}>
        <ChatBot className={this.classes.chatbot}
                 style={{
                   background: '#ffffff',
                   fontFamily: 'inherit',
                   width: '100%',
                   borderRadius: 'inherit',
                   boxShadow: 'none'
                 }}
                 steps={steps}
                 botAvatar='icons/InfiniGrow - white logo SVG.svg'
                 avatarStyle={{
                   backgroundColor: '#6c7482',
                   borderRadius: '50%',
                   padding: '11px 7px',
                   minWidth: '15px',
                   width: '21px',
                   height: '12px'
                 }}
                 bubbleStyle={{
                   clipPath: 'polygon(5% 0, 100% 0%, 100% 100%, 5% 100%, 5% 40%, 0 30%, 5% 20%)',
                   borderRadius: '14px 7px 7px 14px',
                   paddingLeft: '20px',
                   margin: '0',
                   background: '#e6e8f0',
                   fontSize: '18px',
                   fontWeight: '500',
                   color: '#3e495a',
                   boxShadow: 'none'
                 }}
                 hideUserAvatar={true}
                 width='650px'
                 headerComponent={<CustomizedHeader/>}
                 hideSubmitButton={true}/>
      </Page>
    </div>;
  }
}

export class CustomizedHeader extends Component {

  style = style;

  render() {
    return <div>
      <div className={this.classes.title}>
        Improve your current committed plan
      </div>
      <div className={this.classes.subtitle}>
        Here you can get specific improvement suggestions on your current plan.
      </div>
    </div>;
  }
}