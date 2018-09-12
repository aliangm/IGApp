import React from 'react';
import Component from 'components/Component';
import style from 'styles/dashboard/steps.css';
import Step from 'components/pages/dashboard/Step';
import history from 'history';
import Avatar from 'components/Avatar';
import {getProfileSync} from 'components/utils/AuthService';

export default class Steps extends Component {

  style = style;

  render() {
    const doesHaveAttribution = this.props.userAccount.permissions && this.props.userAccount.permissions.attribution;
    const plan = this.props.userAccount.steps && this.props.userAccount.steps.plan;
    const attribution = this.props.attribution.channelsImpact && this.props.attribution.channelsImpact.conversion;
    const campaign = this.props.userAccount.steps && this.props.userAccount.steps.campaign;
    const idea = this.props.userAccount.steps && this.props.userAccount.steps.campaignIdea;
    const plannedVsActual = this.props.userAccount.steps && this.props.userAccount.steps.plannedVsActual;
    const member = this.props.userAccount.teamMembers.find(member => member.userId === getProfileSync().user_id);
    return <div hidden={(plan && attribution && campaign && idea && plannedVsActual) || this.props.userAccount.dontShowSteps}>
      <div>
        <div className={this.classes.center}>
          <Avatar member={member} className={this.classes.picture}/>
        </div>
        <div className={this.classes.title}>
          {"Welcome to InfiniGrow" + ((member && member.name) ? ", " + member.name.split(' ')[0] : '') + "!"}
        </div>
        <div className={this.classes.subTitle}>
          Getting Started
        </div>
        <div className={this.classes.text}>
          {"You’re on your way to better marketing performance.\n" +
          "Complete these steps to get set up:"}
        </div>
      </div>
      <div>
        <Step
          icon="step:profile"
          title="1. Set up a profile"
          text="Kick off your marketing plan by setting up your company profile. You can also invite the rest of your team members."
          action="Set a Profile"
          done={true}
        />
        <Step
          icon="step:plan"
          title="2. Plan/edit your budget"
          text="Every plan starts with a first step. Take your first step by planning your first budget. Don’t take it too hard, it will adjust. A lot."
          action="Add a budget"
          done={plan}
          onClick={()=> { history.push('/plan/annual') }}
        />
        <Step
          icon="step:attribution"
          title="3. Implement Attribution"
          text={"You can learn and improve a lot from actal data. " + (doesHaveAttribution ? 'Implement Attribution' : 'Upgrade')  + " to track leads’ and users’ actions and interactions with your brand."}
          action={doesHaveAttribution ? "Install script" : 'Upgrade'}
          done={attribution}
          onClick={()=> { doesHaveAttribution ? history.push('/measure/attribution/setup') : window.open('mailto:support@infinigrow.com?Subject=InfiniGrow - request to upgrade - Attribution','email') }}
        />
        <Step
          icon="step:campaign"
          title="4. Create a new campaign"
          text="Understood where and how you’re going to spend your budget? Now it’s time to create campaigns and activities under those budgets."
          action="Add a campaign"
          done={campaign}
          onClick={()=> { history.push('/campaigns/by-channel') }}
        />
        <Step
          icon="step:idea"
          title="5. Create a new campaign idea"
          text="Sometimes you’re not sure what campaigns you’re going to launch in the future. Add an initiative idea which you can later explore."
          action="Add an idea"
          done={idea}
          onClick={()=> { history.push('/campaigns/ideas') }}
        />
        <Step
          icon="step:plannedVsActual"
          title="6. Fill/upload actuals at the end of a month"
          text="You’ve planned to invest $X in Y channels. But sometimes planning is one thing, reallity is other. That’s fine, just upload your actual spend."
          action="Add actuals"
          done={plannedVsActual}
          onClick={()=> { history.push('/plan/planned-vs-actual') }}
        />
      </div>
      <div className={this.classes.text} style={{ marginBottom: '15px' }}>
        Don’t want to see this guide? Click
        <div style={{ color: '#c62b36', cursor: 'pointer' }} onClick={() => { this.props.updateUserAccount({dontShowSteps: true}) }}>
          {" here"}
        </div>
      </div>
    </div>
  }
}