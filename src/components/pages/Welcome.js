import React from 'react';

import Component from 'components/Component';
import Page from 'components/Page';
import NextButton from 'components/pages/profile/NextButton';
import SaveButton from 'components/pages/profile/SaveButton';

import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';

import Title from 'components/onboarding/Title';

import style from 'styles/onboarding/onboarding.css';
import welcomeStyle from 'styles/welcome/welcome.css';
import PlannedVsActualstyle from 'styles/plan/planned-actual-tab.css';

import { isPopupMode } from 'modules/popup-mode';
import history from 'history';
import RegionPopup from 'components/RegionPopup';
import ReasonPopup from 'components/ReasonPopup';
import serverCommunication from 'data/serverCommunication';
import ButtonWithSurePopup from 'components/pages/account/ButtonWithSurePopup';
import AddMemberPopup from 'components/pages/account/AddMemberPopup';
import Tabs from 'components/onboarding/Tabs';
import Avatar from 'components/Avatar';
import {getProfileSync} from 'components/utils/AuthService';

export default class Welcome extends Component {
  style = style;
  styles = [welcomeStyle, PlannedVsActualstyle];

  static defaultProps = {
    userAccount: {
      companyName: '',
      firstName: '',
      lastName: '',
      companyWebsite: 'http://',
      competitorsWebsites: ['http://', 'http://', 'http://'],
      teamMembers: [],
      createNewVisible: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      inviteMessage: null,
      showAddMemberPopup: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }

  componentDidMount() {
    if(this.props.location.query.new) {
      const teamMembers = [{
        email: getProfileSync().email,
        name: '',
        role: '',
        userId: getProfileSync().user_id
      }];
      const json = {
        teamMembers: teamMembers
      };
      if (this.props.location.query.freePlan === "true") {
        json['permissions.plannerAI'] = false;
        json['pages.dashboard'] = true;
      }
      else {
        json['permissions.plannerAI'] = true;
        json['pages.plan'] = true;
      }
      this.props.createUserAccount(json)
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleChange(parameter, event) {
    let update = Object.assign({}, this.props.userAccount);
    update[parameter] = event.target.value;
    this.props.updateState({userAccount: update});
  }

  handleChangeName(index, event) {
    let update = Object.assign({}, this.props.userAccount);
    update.teamMembers[index].name = event.target.value;
    this.props.updateState({userAccount: update});
  }

  handleChangeNumber(parameter, event) {
    let number = parseInt(event.target.value);
    if (isNaN(number)) {
      number = -1;
    }
    let update = Object.assign({}, this.props.userAccount);
    update[parameter] = number;
    this.props.updateState({userAccount: update});
  }

  handleChangeSelect(parameter, event) {
    let update = Object.assign({}, this.props.userAccount);
    update[parameter] = event.value;
    this.props.updateState({userAccount: update});
  }

  handleChangeRole(event) {
    let update = Object.assign({}, this.props.userAccount);
    update.teamMembers[0].role = event.value;
    this.props.updateState({userAccount: update});
  }

  handleChangeArray(parameter, index, event) {
    let update = Object.assign({}, this.props.userAccount);
    update[parameter][index] = event.target.value;
    this.props.updateState({userAccount: update});
  }

  addMember() {
    let update = Object.assign({}, this.props.userAccount);
    update.teamMembers.push({name: '', email: '', role: ''});
    this.props.updateState({userAccount: update});
  }

  removeMember(index) {
    let update = Object.assign({}, this.props.userAccount);
    const member = update.teamMembers.splice(index, 1);
    this.props.updateState({userAccount: update});
    serverCommunication.serverRequest('DELETE', 'members', JSON.stringify(member[0]))
      .then((response) => {
        if (response.ok) {
          this.setState({inviteMessage: 'user has been removed successfully!'});
        }
        else {
          this.setState({inviteMessage: 'failed to remove user'});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  inviteMember(newMember) {
    serverCommunication.serverRequest('PUT', 'members', JSON.stringify({newMember, admin: { name: this.props.userAccount.firstName + ' ' + this.props.userAccount.lastName, company: this.props.userAccount.companyName }}))
      .then((response) => {
        if (response.ok) {
          this.setState({inviteMessage: 'user has been invited successfully!', showAddMemberPopup: false});
          response.json()
            .then((data) => {
              const userAccount = this.props.userAccount;
              userAccount.teamMembers = data.teamMembers;
              this.props.updateState({unsaved:false, teamMembers: data.teamMembers, userAccount: userAccount});
            })
        }
        else {
          this.setState({inviteMessage: 'failed to invite user'});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const headRow = this.getTableRow(null, [
      'Name',
      'Email',
      'Role',
      'Admin',
      ''
    ], {
      className: PlannedVsActualstyle.locals.headRow
    });
    const rows = this.props.userAccount.teamMembers.slice(1).map((item, i) => {
      return this.getTableRow(null, [
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { item.name }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { item.email }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { item.role }
        </div>,
        <div className={ welcomeStyle.locals.center }>
          <input type="checkbox" checked={ !!item.isAdmin }/>
        </div>,
        <ButtonWithSurePopup style={{ background: '#e50000' }} onClick={ this.removeMember.bind(this, i) } buttonText="Remove"/>
      ], {
        key: i
      });
    });
    const selects = {
      role: {
        label: 'Your role',
        labelQuestion: false,
        select: {
          menuTop: true,
          name: 'role',
          onChange: () => {},
          options: [
            {value: 'CMO', label: 'CMO'},
            {value: 'VP Marketing', label: 'VP Marketing'},
            {value: 'Chief Marketing Technologist', label: 'Chief Marketing Technologist'},
            {value: 'Director of Marketing', label: 'Director of Marketing'},
            {value: 'Head of Marketing', label: 'Head of Marketing'},
            {value: 'Marketing Manager', label: 'Marketing Manager'},
            {value: 'CEO', label: 'CEO'},
            {value: 'CRO', label: 'CRO'},
            {value: 'Marketer', label: 'Marketer'},
          ]
        }
      }
    };
    const title = isPopupMode() ? "Welcome! Let's get you started" : "Account";
    const member = this.props.userAccount.teamMembers.find(member => member.userId === getProfileSync().user_id);
    const memberIndex = this.props.userAccount.teamMembers.findIndex(member => member.userId === getProfileSync().user_id);
    const userAccount = <div>
      <div className={ this.classes.row }>
        <Label>Name</Label>
        <Textfield value={ member && member.name } onChange={ this.handleChangeName.bind(this, memberIndex)}/>
      </div>
      <div className={ this.classes.row }>
        <Select { ... selects.role } className={ welcomeStyle.locals.select } selected={ member && member.role} onChange={ this.handleChangeRole.bind(this)}/>
      </div>
      <div className={ this.classes.row }>
        <Label>Email</Label>
        <Textfield value={ member && member.email } readOnly={true}/>
      </div>
      <div className={ this.classes.row }>
        <Label>Picture</Label>
        <Avatar member={member} className={welcomeStyle.locals.userPicture}/>
      </div>
    </div>;
    const companyAccount = <div>
      <div className={ this.classes.row }>
        <Label>Enter your brand/company name</Label>
        <Textfield value={ this.props.userAccount.companyName } onChange={ this.handleChange.bind(this, 'companyName')}/>
      </div>
      <div className={ this.classes.row }>
        <Label>Company Website</Label>
        <Textfield value={ this.props.userAccount.companyWebsite } onChange={ this.handleChange.bind(this, 'companyWebsite')}/>
      </div>
      { !isPopupMode() ?
        <div className={this.classes.row}>
          <Label>Team Members</Label>
          <div className={welcomeStyle.locals.innerBox}>
            <div className={PlannedVsActualstyle.locals.wrap} ref="wrap"
                 style={{margin: 'initial', overflow: 'visible'}}>
              <div className={PlannedVsActualstyle.locals.box} style={{overflow: 'visible'}}>
                <table className={PlannedVsActualstyle.locals.table}>
                  <thead>
                  {headRow}
                  </thead>
                  <tbody className={PlannedVsActualstyle.locals.tableBody}>
                  {rows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <div className={welcomeStyle.locals.center}>
              <Button
                type="reverse"
                style={{width: '75px', marginTop: '20px'}}
                onClick={() => {
                  this.setState({showAddMemberPopup: true})
                }}>+Add
              </Button>
            </div>
            <div className={welcomeStyle.locals.inviteMessage}>
              {this.state.inviteMessage}
            </div>
          </div>
        </div>
        : null
      }
      <div className={ this.classes.row }>
        <Label>Enter your main competitors' website (up to 3)</Label>
        <Textfield value={ this.props.userAccount.competitorsWebsites[0] } style={{marginBottom: '16px'}}
                   onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 0)}/>
        <Textfield value={ this.props.userAccount.competitorsWebsites[1] } style={{marginBottom: '16px'}}
                   onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 1)}/>
        <Textfield value={ this.props.userAccount.competitorsWebsites[2] } style={{marginBottom: '16px'}}
                   onChange={ this.handleChangeArray.bind(this, 'competitorsWebsites', 2)}/>
      </div>
    </div>;

    return <div>
      <Page popup={ isPopupMode()} className={!isPopupMode() ? welcomeStyle.locals.static: null} innerClassName={welcomeStyle.locals.innerPage}>
        <Title title={ title } subTitle="InfiniGrow is looking to better understand who you are so that it can adjust its recommendations to fit you"/>

        {isPopupMode() ?
          <div className={ this.classes.cols }>
            <div className={ this.classes.colCenter } style={{ maxWidth: '707px' }}>
              {userAccount}
              {companyAccount}
            </div>
          </div>
          :
          <Tabs
            ref="tabs"
            defaultSelected={ 0 }
            defaultTabs={["Company Account", "User Account"]}
          >
            {({ name, index }) => {
              return <div className={ this.classes.cols }>
                <div className={ this.classes.colCenter } style={{ maxWidth: '707px' }}>
                  { index ?
                    userAccount
                    :
                    companyAccount
                  }
                </div>
              </div>
            }}
          </Tabs>
        }

        <div style={{
          height: '30px'
        }}/>

        { isPopupMode() ?

          <div className={ this.classes.footerCols }>
            <div className={ this.classes.footerLeft }>
              <Button type="normal" style={{
                letterSpacing: '0.075',
                width: '150px'
              }} onClick={() => {
                if (this.props.region) {
                  history.push('/settings/profile/product')
                }
                else {
                  if (!this.props.userAccount.reasonForUse) {
                    this.setState({showReasonPopup: true});
                  }
                  else {
                    this.setState({createNewVisible: true});
                  }
                }
              }}>Skip this step</Button>
            </div>
            <div className={ this.classes.footerRight }>
              <div style={{width: '30px'}}/>
              <NextButton onClick={() => {
                this.props.updateUserAccount(this.props.userAccount)
                  .then(() => {
                    if (this.props.region) {
                      history.push('/settings/profile/product')
                    }
                    else {
                      if (!this.props.userAccount.reasonForUse) {
                        this.setState({showReasonPopup: true});
                      }
                      else {
                        this.setState({createNewVisible: true});
                      }
                    }
                  });
              }}/>
            </div>
          </div>

          :
          <div className={ this.classes.footer }>
            <SaveButton onClick={() => {
              this.setState({saveFail: false, saveSuccess: false});
              this.props.updateUserAccount(this.props.userAccount);
              this.setState({saveSuccess: true});
            }} success={ this.state.saveSuccess } fail={ this.state.saveFail }/>
          </div>
        }
      </Page>
      <RegionPopup hidden={ !this.state.createNewVisible } close={()=>{ this.setState({createNewVisible: false}) }} createUserMonthPlan={ this.props.createUserMonthPlan }/>
      <ReasonPopup hidden={ !this.state.showReasonPopup } updateUserAccount={ this.props.updateUserAccount } userAccount={ this.props.userAccount } close={ ()=>{ this.setState({showReasonPopup: false, createNewVisible: true}) } }/>
      <AddMemberPopup hidden={ !this.state.showAddMemberPopup } close={ ()=>{ this.setState({showAddMemberPopup: false}) } } inviteMember={ this.inviteMember.bind(this) }/>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ PlannedVsActualstyle.locals.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ PlannedVsActualstyle.locals.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={ PlannedVsActualstyle.locals.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}