import Component from 'components/Component';
import Page from 'components/Page';
import React, {PropTypes} from 'react';
import ChatBot from 'react-simple-chatbot';
import style from 'styles/plan/plan-optimization-popup.css';
import ConstraintStep from 'components/pages/plan/ConstraintStep';

export default class AddObjectivePopup extends Component {

  style = style;

  static propTypes = {
    hidden: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      channelsLimit: null,
      channelsToBlock: []
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
      component: <ConstraintStep type='channelsNumber' setConstraintAndRunPlanner={this.setConstraintAndRunPlanner}/>
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
      ]
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
      ]
    },
    {
      id: '9',
      message: 'Ok Bye!',
      end: true
    },
    {
      id: '10',
      component: <ClearConstraint clearConstraints={this.clearConstraints}/>,
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
        {value: 1, label: 'I want to lock budgets for specific channels', trigger: '13'},
        {value: 2, label: 'No particular reason, I just don’t like it', trigger: '14'},
        {
          value: 3,
          label: 'I want to limit the number of channels that will be touched in the suggestion',
          trigger: '6'
        }
      ]
    },
    {
      id: '13',
      component: <ConstraintStep type='lockingChannels' setConstraintAndRunPlanner={this.setConstraintAndRunPlanner}/>
    },
    {
      id: '14',
      component: <NoParticularReasonStep noParticularReasonAndRun={this.noParticularReasonAndRun}/>,
      asMessage: true
    }
  ];

  clearConstraints = () => {
    this.setState({channelsLimit: null, channelsToBlock: []});
  };

  setConstraintAndRunPlanner = (changeObject, callback) => {
    this.setState(changeObject, this.runPlannerWithConstraints(callback));
  };

  noParticularReasonAndRun = (callback) => {
    console.log('setting lock on all suggested channels');
    this.runPlannerWithConstraints(callback);
  }

  runPlannerWithConstraints = (callback) => {
    console.log('run the planner with state constraint');
    callback();
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
                 hideSubmitButton={true}
                 steps={this.getSteps()}
                 customStyle={{
                   background: 'transparent',
                   border: 'none',
                   boxShadow: 'none'
                 }}/>
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

class ClearConstraint extends Component {
  componentDidMount() {
    this.props.clearConstraints();
    this.props.triggerNextStep({trigger: '4'});
  }

  render() {
    return <div>{'That’s great :)\n' +
    'Do you have specific requirements for the reallocation suggestion?'}</div>;
  }
}

class NoParticularReasonStep extends Component {
  componentDidMount() {
    this.props.noParticularReasonAndRun(() => this.props.triggerNextStep({trigger: '7'}));
  }

  render() {
    return <div>{'OK trying to run again'}</div>;
  }
}