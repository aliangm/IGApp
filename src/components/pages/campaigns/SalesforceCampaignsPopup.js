import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import Label from 'components/ControlsLabel';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';
import CRMStyle from 'styles/indicators/crm-popup.css';
import { formatChannels } from 'components/utils/channels';

export default class SalesforceAutomaticPopup extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      types: [],
      statuses: [],
      owners: [],
      campaigns: [],
      code: null,
      hidden: true,
      campaignsMapping: {
        statuses: {

        },
        types: {

        },
        owners: {

        }
      },
      selectedCampaigns: [],
      tab: 0
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', 'salesforceapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                this.setState({url: data});
              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.campaignsMapping) {
      this.setState({campaignsMapping: nextProps.data.campaignsMapping});
    }
  }

  getAuthorization() {
    if (!this.props.data) {
      const win = window.open(this.state.url);
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          const code = localStorage.getItem('code');
          if (code) {
            localStorage.removeItem('code');
            this.setState({code: code});
            this.getMapping(code);
          }
        }
      }, 1000);
    }
    else {
      this.getMapping();
    }
  }

  getMapping(code) {
    serverCommunication.serverRequest('post', 'salesforcecampaignsapi', JSON.stringify({code: code}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({statuses: data.statuses, types: data.types, owners: data.owners, campaigns: data.campaigns, selectedCampaigns: data.campaigns.map(campaign => campaign.Id), hidden: false});
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  getUserData() {
    serverCommunication.serverRequest('put', 'salesforcecampaignsapi', JSON.stringify({campaignsMapping: this.state.campaignsMapping, selectedCampaigns: this.state.selectedCampaigns}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.close();
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  toggleCheckbox(campaignId) {
    let selectedCampaigns = this.state.selectedCampaigns;
    const index = selectedCampaigns.indexOf(campaignId);
    if (index === -1) {
      selectedCampaigns.push(campaignId)
    }
    else {
      selectedCampaigns.splice(index, 1);
    }
    this.setState({selectedCampaigns: selectedCampaigns});
  }

  handleChange(item, type, event) {
    let campaignsMapping = this.state.campaignsMapping;
    campaignsMapping[type][item] = event.value;
    this.setState({campaignsMapping: campaignsMapping});
  }

  close() {
    this.setState({hidden: true, tab: 0});
    this.props.close();
  }

  next() {
    const isEmpty = Object.keys(this.refs).some(ref => {
      if (!this.refs[ref].props.selected){
        this.refs[ref].focus();
        return true;
      }
      return false;
    });
    if (!isEmpty) {
      this.setState({tab: 1})
    }
  }

  render(){
    const selects = {
      owners: {
        select: {
          name: 'owners',
          options: this.props.userAccount.teamMembers
            .map(member => {
              return {value: member.userId, label: member.name}
            })
        }
      },
      channels: {
        select: {
          name: "channels",
          options: formatChannels()
        }
      },
      statuses: {
        select: {
          name: "statuses",
          options: [
            {value: 'New', label: 'New'},
            {value: 'Assigned', label: 'Assigned'},
            {value: 'In Progress', label: 'In Progress'},
            {value: 'In Review', label: 'In Review'},
            {value: 'Approved', label: 'Approved'},
            {value: 'Completed', label: 'Completed'},
            {value: 'On Hold', label: 'On Hold'},
            {value: 'Rejected', label: 'Rejected'},
          ]
        }
      }
    };
    selects.owners.select.options.push({value: this.props.userAccount.UID, label: this.props.userAccount.firstName + ' ' + this.props.userAccount.lastName});
    const ownersRows = this.state.owners.map((owner, index) =>
      <div className={ this.classes.row } key={index}>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
            <Label className={ salesForceStyle.locals.label }>{owner.Name}</Label>
          </div>
          <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
            <div className={ salesForceStyle.locals.arrow }/>
          </div>
          <div className={ this.classes.colRight }>
            <Select { ... selects.owners} style={{ width: '270px'}} selected={this.state.campaignsMapping.owners[owner.Id]} onChange={this.handleChange.bind(this, owner.Id, 'owners')}/>
          </div>
        </div>
      </div>
    );
    const typesRows = this.state.types.map((type, index) =>
      <div className={ this.classes.row } key={index}>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
            <Label className={ salesForceStyle.locals.label }>{type.Type}</Label>
          </div>
          <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
            <div className={ salesForceStyle.locals.arrow }/>
          </div>
          <div className={ this.classes.colRight }>
            <Select { ... selects.channels}
                    style={{ width: '270px'}}
                    selected={this.state.campaignsMapping.types[type.Type]}
                    onChange={this.handleChange.bind(this, type.Type, 'types')}
                    ref={"type" + index}
            />
          </div>
        </div>
      </div>
    );
    const statusesRows = this.state.statuses.map((status, index) =>
      <div className={ this.classes.row } key={index}>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
            <Label className={ salesForceStyle.locals.label }>{status.Status}</Label>
          </div>
          <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
            <div className={ salesForceStyle.locals.arrow }/>
          </div>
          <div className={ this.classes.colRight }>
            <Select { ... selects.statuses} style={{ width: '270px'}} selected={this.state.campaignsMapping.statuses[status.Status]} onChange={this.handleChange.bind(this, status.Status, 'statuses')}/>
          </div>
        </div>
      </div>
    );
    const campaignsRows = this.state.campaigns.map((campaign, index) =>
      <Label
        key={index}
        style={{ textTransform: 'capitalize' }}
        checkbox={this.state.selectedCampaigns.includes(campaign.Id)}
        onChange={ this.toggleCheckbox.bind(this, campaign.Id) }
      >
        {campaign.Name}
      </Label>
    );
    return <div style={{ width: '100%' }}>
      <div className={ CRMStyle.locals.salesforce } onClick={ this.getAuthorization.bind(this) }/>
      <div hidden={this.state.hidden}>
        <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
          { this.state.tab === 0 ?
            <div>
              <Title title="SalesForce - map fields"/>
              <div className={ this.classes.row }>
                <Label style={{ fontSize: '20px' }}>Owners</Label>
              </div>
              {ownersRows}
              <div className={ this.classes.row }>
                <Label style={{ fontSize: '20px' }}>Types / Channels</Label>
              </div>
              {typesRows}
              <div className={ this.classes.row }>
                <Label style={{ fontSize: '20px' }}>Statuses</Label>
              </div>
              {statusesRows}
              <div className={ this.classes.footer }>
                <div className={ this.classes.footerLeft }>
                  <Button type="normal" style={{ width: '100px' }} onClick={ this.close.bind(this) }>Cancel</Button>
                </div>
                <div className={ this.classes.footerRight }>
                  <Button type="primary2" style={{ width: '100px' }} onClick={ this.next.bind(this) }>Next</Button>
                </div>
              </div>
            </div>
            :
            <div>
              <Title title="SalesForce - Import Campaigns"/>
              <div className={ this.classes.row }>
                <Label style={{ fontSize: '20px' }}>Choose which campaigns to import</Label>
              </div>
              {campaignsRows}
              <div className={ this.classes.footer }>
                <div className={ this.classes.footerLeft }>
                  <Button type="normal" style={{ width: '100px' }} onClick={ () => { this.setState({tab: 0}) } }>Back</Button>
                </div>
                <div className={ this.classes.footerRight }>
                  <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
                </div>
              </div>
            </div>
          }
        </Page>
      </div>
    </div>
  }

}