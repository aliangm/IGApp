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
      selectAll: true,
      customers: [],
      campaigns: [],
      code: null,
      hidden: true,
      selectedCampaigns: [],
      tab: 0
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', 'adwordsapi')
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

  selectAll() {
    this.setState({selectAll: !this.state.selectAll}, () => {
      let selectedCampaigns = [];
      if (this.state.selectAll) {
        selectedCampaigns = this.state.campaigns.map(campaign => campaign.id);
      }
      this.setState({selectedCampaigns: selectedCampaigns});
    })
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
    serverCommunication.serverRequest('post', 'adwordsapi', JSON.stringify({code: code}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({customers: data, hidden: false});
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

  getUserData (withoutCommit) {
    const json = {customerId: this.state.selectedCustomer};
    if (!withoutCommit) {
      json.campaignsIds = this.state.selectedCampaigns;
    }
    serverCommunication.serverRequest('put', 'adwordsapi', JSON.stringify(json), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              if (withoutCommit) {
                this.setState({campaigns: data, selectedCampaigns: data.map(campaign => campaign.id), tab: 1});
              }
              else {
                this.props.setDataAsState(data);
                this.close();
              }
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

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

  close() {
    this.setState({hidden: true, tab: 0});
    this.props.close();
  }

  next() {
    // TODO: check if empty

    this.getUserData(true);
  }

  render(){
    const selects = {
      customers: {
        select: {
          name: 'customers',
          options: this.state.customers
            .map(customer => {
              return {value: customer.customerId, label: customer.descriptiveName + " (" + customer.customerId + ")"}
            })
        }
      }
    };
    const campaignsRows = this.state.campaigns.map((campaign, index) =>
      <Label
        key={index}
        style={{ textTransform: 'capitalize' }}
        checkbox={this.state.selectedCampaigns.includes(campaign.id)}
        onChange={ this.toggleCheckbox.bind(this, campaign.id) }
      >
        {campaign.name}
      </Label>
    );
    return <div style={{ width: '100%' }}>
      <div className={ CRMStyle.locals.adwords } onClick={ this.getAuthorization.bind(this) }/>
      <div hidden={this.state.hidden}>
        <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
          { this.state.tab === 0 ?
            <div>
              <Title title="Google AdWords - choose customer"/>
              <div className={ this.classes.row }>
                <Select { ... selects.customers } selected={ this.state.selectedCustomer} onChange={ (e)=> { this.setState({selectedCustomer: e.value}); } }/>
              </div>
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
              <Title title="Google AdWords - Import Campaigns"/>
              <div className={ this.classes.row }>
                <Label style={{ fontSize: '20px', textTransform: 'capitalize' }}>Choose which campaigns to import</Label>
              </div>
              <div className={ this.classes.row }>
                <Label
                  style={{ textTransform: 'capitalize' }}
                  checkbox={this.state.selectAll}
                  onChange={ this.selectAll.bind(this) }
                >
                  Select All
                </Label>
              </div>
              {campaignsRows}
              <div className={ this.classes.footer }>
                <div className={ this.classes.footerLeft }>
                  <Button type="normal" style={{ width: '100px' }} onClick={ () => { this.setState({tab: 0}) } }>Back</Button>
                </div>
                <div className={ this.classes.footerRight }>
                  <Button type="primary2" style={{ width: '100px' }} onClick={ () => { this.getUserData(false) }}>Done</Button>
                </div>
              </div>
            </div>
          }
        </Page>
      </div>
    </div>
  }

}