import React from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import Page from 'components/Page';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import MultiSelect from 'components/controls/MultiSelect';
import {formatChannels} from 'components/utils/channels';
import Toggle from 'components/controls/Toggle';
import style from 'styles/onboarding/onboarding.css';
import popupStyle from 'styles/welcome/add-member-popup.css';

export default class AddMemberPopup extends Component {

  style = style;
  styles = [popupStyle];

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      role: '',
      isAdmin: false,
      specificChannels: [],
      isSpecificChannels: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      this.setState({
        name: '',
        email: '',
        role: '',
        isAdmin: false,
        specificChannels: [],
        isSpecificChannels: false
      });
    }
  }

  handleChangeChannels(event) {
    let update = event.map((obj) => {
      return obj.value;
    });
    this.setState({specificChannels: update});
  }

  render() {
    const channels = {
      select: {
        name: 'channels',
        options: formatChannels()
      }
    };
    return <div hidden={this.props.hidden}>
      <Page popup={true} width={'400px'} contentClassName={popupStyle.locals.content}
            innerClassName={popupStyle.locals.inner}>
        <div className={popupStyle.locals.title}>
          Invite Users
        </div>
        <div className={this.classes.row}>
          <Label>Name</Label>
          <Textfield
            value={this.state.name}
            onChange={(e) => {
              this.setState({name: e.target.value});
            }}
          />
        </div>
        <div className={this.classes.row}>
          <Label>Email</Label>
          <Textfield
            value={this.state.email}
            onChange={(e) => {
              this.setState({email: e.target.value});
            }}
          />
        </div>
        <div className={this.classes.row}>
          <Label>Role</Label>
          <Textfield
            value={this.state.role}
            onChange={(e) => {
              this.setState({role: e.target.value});
            }}
          />
        </div>
        <div className={this.classes.row} style={{display: 'inline-block'}}>
          <Label>Permissions</Label>
          <Toggle
            options={[{
              text: 'Admin',
              value: true
            },
              {
                text: 'User',
                value: false
              }
            ]}
            selectedValue={this.state.isAdmin}
            onClick={(value) => {
              this.setState({isAdmin: value});
            }}/>
        </div>
        {!this.state.isAdmin ?
          <div className={this.classes.row}>
            <Label checkbox={this.state.isSpecificChannels} onChange={() => {
              this.setState({isSpecificChannels: !this.state.isSpecificChannels});
            }}>
              choose specific channels to view/edit
            </Label>
            <MultiSelect {...channels} selected={this.state.specificChannels}
                         onChange={this.handleChangeChannels.bind(this)} style={{width: 'initial'}}
                         disabled={!this.state.isSpecificChannels}/>
          </div>
          : null
        }
        <div className={this.classes.footerCols}>
          <div className={this.classes.footerLeft}>
            <Button
              type="secondary"
              style={{width: '72px'}}
              onClick={this.props.close}>Cancel
            </Button>
            <Button
              type="primary"
              style={{width: '110px', marginLeft: '20px'}}
              onClick={() => {
                this.props.inviteMember(this.state);
              }}>Invite User
            </Button>
          </div>
        </div>
      </Page>
    </div>;
  }
}