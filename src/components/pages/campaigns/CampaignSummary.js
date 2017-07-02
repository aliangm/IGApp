import React from 'react';

import Component from 'components/Component';
import Label from 'components/ControlsLabel';
import CampaignPopup from 'components/pages/campaigns/CampaignPopup';

import style from 'styles/campaigns/campaign-summary.css';
import icons from 'styles/icons/plan.css';

export default class CampaignSummary extends Component {

  style = style
  styles = [icons]

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    }
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    this.setState({showPopup: false});
  }

  render(){
    const budget = this.props.campaign.actualSpent || this.props.campaign.budget;
    return <div className={ this.classes.item }>
      <div className={ this.classes.top }>
        <div className={ this.classes.row } style={{  }}>
          <div className={ this.classes.cols }>
            <div className={ this.classes.colLeft } style={{ height: '63px' }}>
              { this.props.campaign.name }
            </div>
            <div className={ this.classes.colRight }>
              <div className={ this.classes.menu } data-icon="campaign:menu" onClick={() => { this.setState({showPopup: true}) }}/>
            </div>
          </div>
        </div>
        <div className={ this.classes.row } style={{ color: '#2CF212' }}>
          <div className={ this.classes.cols }>
            <div className={ this.classes.colLeft }>
              ${ budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
            </div>
            <div className={ this.classes.colRight }>
              <div className={ this.classes.circle }>
                <div className={ this.classes.icon } data-icon={this.props.channelIcon}>
                </div>
                <div className={ this.classes.number }>
                  { this.props.index+1 }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ this.classes.bottom }>
        <div className={ this.classes.row } style={{ textAlign: 'center', paddingTop: '20px' }}>
          <div className={ this.classes.status }>
            { this.props.campaign.status }
          </div>
          <div className={ this.classes.row } style={{ marginTop: '15px' }}>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ justifyContent: 'center' }}>
                <Label className={ this.classes.time }>
                  Marketing
                </Label>
                <Label className={ this.classes.time }>
                  {this.props.campaign.time.marketing}h
                </Label>
              </div>
              <div className={ this.classes.colCenter } style={{ justifyContent: 'center' }}>
                <Label className={ this.classes.time }>
                  Design
                </Label>
                <Label className={ this.classes.time }>
                  {this.props.campaign.time.design}h
                </Label>
              </div>
              <div className={ this.classes.colRight }>
                <Label className={ this.classes.time }>
                  Development
                </Label>
                <Label className={ this.classes.time }>
                  {this.props.campaign.time.development}h
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div hidden={ !this.state.showPopup }>
        <CampaignPopup campaign={ this.props.campaign } channelTitle={ this.props.channelTitle } channel={ this.props.channel } closePopup={ this.closePopup } updateCampaign={ this.props.updateCampaign } index={ this.props.index } teamMembers={ this.props.teamMembers } campaignsTemplates={ this.props.campaignsTemplates } updateCampaignsTemplates={ this.props.updateCampaignsTemplates } firstName={ this.props.firstName } lastName={ this.props.lastName }/>
      </div>
    </div>
  }

}