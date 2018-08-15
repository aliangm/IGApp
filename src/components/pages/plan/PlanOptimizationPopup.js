import Component from 'components/Component';
import Page from 'components/Page';
import React, {PropTypes} from 'react';
import ChatBot from 'react-simple-chatbot';
import style from 'styles/plan/plan-optimization-popup.css';
import ConstraintStep from 'components/pages/plan/ConstraintStep';

class ClearConstraint extends Component {
  componentDidMount(){
    this.props.clearConstraints();
    this.props.triggerNextStep({trigger: '4'});
  }

  render() {
    return <div>{'That’s great :)\n' +
      'Do you have specific requirements for the reallocation suggestion?'}</div>;
  }
};

export default class AddObjectivePopup extends Component {

  style = style;

  static propTypes = {
    hidden: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      channelsLimit: null
    };
  }

  getSteps = () => [
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
      component: <ConstraintStep setConstraintAndRunPlanner={this.setConstraintAndRunPlanner}/>
    },
    {
      id: '7',
      options: [
        {value: 1, label: 'Approve', trigger: '8'},
        {
          value: 2,
          label: 'Decline',
          trigger: '11'
        }
      ],
    },
    {
      id: '8',
      options: [
        {value: 1, label: 'Close', trigger: '9'},
        {
          value: 2,
          label: 'Get a new suggestion',
          trigger: '10'
        }
      ],
    },
    {
      id: '9',
      message: "Ok Bye!",
      end: true
    },
    {
      id: '10',
      component: <ClearConstraint clearConstraints={this.clearConstraints} />,
      asMessage: true
    },
    {
      id: '11',
      message: 'why?',
      trigger: '12'
    },
    {
      id: '12',
      options: [
        {value: 1, label:  'I want to lock budgets for specific channels', trigger: '13'},
        {value: 2, label:  'No particular reason, I just don’t like it', trigger: '14'},
        {
          value: 3,
          label: 'I want to limit the number of channels that will be touched in the suggestion',
          trigger: '6'
        }
      ],
    },
    {
      id: '13',
      message: 'Ok locking',
      end: true
    },
    {
      id: '14',
      message: 'OK running again',
      end: true
    }
  ];

  clearConstraints = () => {
    this.setState({channelsLimit: null});
  };

  setConstraintAndRunPlanner = (channelsLimit, callback) => {
    this.setState({channelsLimit: channelsLimit},
      () => {
        console.log('run the planner with state constraint');
        callback();
      }
    );
  };

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} contentClassName={this.classes.content} innerClassName={this.classes.inner} centered={true}>
        <div className={this.classes.chatBot}>
          <ChatBot steps={this.getSteps()} customStyle={{
            background: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }}/>
        </div>
      </Page>
    </div>;
  }
}