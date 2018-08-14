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
      <Page popup={true} contentClassName={this.classes.content} innerClassName={this.classes.inner} centered={true}>
        <div className={this.classes.chatBot}>
          <ChatBot steps={steps}/>
        </div>
      </Page>
    </div>;
  }
}