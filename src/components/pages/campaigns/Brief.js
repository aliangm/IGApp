import React from 'react';
import Component from 'components/Component';
import Label from 'components/ControlsLabel';
import Textfield from 'components/controls/Textfield';
import Select from 'components/controls/Select';
import Calendar from 'components/controls/Calendar';
import Button from 'components/controls/Button';
import SaveButton from 'components/pages/profile/SaveButton';
import AssetsPopup from 'components/pages/campaigns/AssetsPopup';
import style from 'styles/onboarding/onboarding.css';
import campaignPopupStyle from 'styles/campaigns/capmaign-popup.css';
import MultiSelect from 'components/controls/MultiSelect';
import channelsSchema from 'data/channelsSchema';

export default class Brief extends Component {

  style = style;
  styles = [campaignPopupStyle];

  constructor(props) {
    super(props);
    this.state = {};
    this.validate = this.validate.bind(this);
    this.save = this.save.bind(this);
    this.getEmailBody = this.getEmailBody.bind(this);
    this.getEmailHeader = this.getEmailHeader.bind(this);
    this.getEmailTo = this.getEmailTo.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  static defaultProps = {
    teamMembers: []
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(e) {
    /**
     if (e.key === 'Enter') {
      this.save();
    }
     **/
    if (e.key === 'Escape') {
      this.props.close();
    }
  }

  handleChangeSource = (event) => {
    let update = Object.assign({}, this.props.campaign);
    update.source = event.map((obj) => {
      return obj.value;
    });
    this.props.updateState({campaign: update});
  };

  handleChangeBudget(parameter, event){
    let update = Object.assign({}, this.props.campaign);
    update[parameter] = parseInt(event.target.value.replace(/[-$h,]/g, ''));
    this.props.updateState({campaign: update});
  }

  handleChangeText(parameter, event) {
    let update = Object.assign({}, this.props.campaign);
    update[parameter] = event.target.value;
    this.props.updateState({campaign: update});
  }

  handleChangeTime(parameter, event){
    let update = Object.assign({}, this.props.campaign);
    update.time[parameter] = parseInt(event.target.value.replace(/[-h.]/g, ''));
    this.props.updateState({campaign: update});
  }

  handleChangeSelect(parameter, event){
    let update = Object.assign({}, this.props.campaign);
    update[parameter] = event.value;
    this.props.updateState({campaign: update});
  }

  handleChangeObjectives(parameter, index, event) {
    let update = Object.assign({}, this.props.campaign);
    update.objectives[parameter][index] = event.target.value;
    this.props.updateState({campaign: update});
  }

  handleChangeTracking(parameter, event) {
    let update = Object.assign({}, this.props.campaign);
    update.tracking[parameter] = event.target.value;
    this.props.updateState({campaign: update});
  }

  handleChangeDate(parameter, value) {
    let update = Object.assign({}, this.props.campaign);
    update[parameter] = value;
    this.props.updateState({campaign: update});
  }

  validate() {
    return this.props.campaign.name && this.props.campaign.source && this.props.campaign.source.length > 0;
  }

  save() {
    if (this.validate()) {
      this.props.updateState({unsaved: false});
      this.props.updateCampaign(this.props.campaign)
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
        });
      this.props.closePopup();
    }
    else {
      if (!this.props.campaign.name){
        this.refs.name.focus();
      }
      else {
        this.refs.source.focus();
      }
    }
  }

  archive() {
    let update = Object.assign({}, this.props.campaign);
    update.isArchived = true;
    this.props.updateState({campaign: update, unsaved: false});
    this.props.updateCampaign(update)
      .then(() => {
      })
      .catch((err) => {
        console.log(err);
      });
    this.props.closePopup();
  }

  getEmailTo() {
    return (this.props.campaign.owner ?
      this.props.campaign.owner.value == "me" ?
        this.props.email :
        this.props.teamMembers
          .filter((item) => {
            return item.name == this.props.campaign.owner;
          })
          .map((item) => {
            return item.email;
          })
      : '');
  }

  getEmailHeader() {
    return "InfiniGrow  - New Marketing Campaign - " + this.props.campaign.name;
  }

  getEmailBody() {
    const newLine = "\r\n";
    return "Congrats! you have been assigned to a new marketing campaign through InfiniGrow. Let's have a look at the brief:" + newLine +
      newLine +
      "- Source: " + this.props.channelTitle + newLine +
      "- Campaign Name: " + this.props.campaign.name + newLine +
      "- Campaign Budget: " + (this.props.campaign.actualSpent || this.props.campaign.budget) + newLine +
      "- Status: " + this.props.campaign.status + newLine +
      newLine +
      (this.props.campaign.time && this.props.campaign.time.marketing ? ("- Expected marketing time: " + this.props.campaign.time.marketing + " hours" + newLine) : '') +
      (this.props.campaign.time && this.props.campaign.time.development ? ("- Expected development time: " + this.props.campaign.time.development + " hours" + newLine) : '') +
      (this.props.campaign.time && this.props.campaign.time.design ? ("- Expected design time: " + this.props.campaign.time.design + " hours" + newLine) : '') +
      newLine +
      (this.props.campaign.dueDate ? ("Due date: " + this.props.campaign.dueDate + newLine + newLine) : '') +
      (this.props.campaign.startDate ? ("Start date: " + this.props.campaign.startDate + newLine + newLine) : '') +
      "Campaign objectives:" + newLine +
      (this.props.campaign.objectives && this.props.campaign.objectives.kpi[0] ? ("- KPI: " + this.props.campaign.objectives.kpi[0] + ", Growth: " + this.props.campaign.objectives.growth[0] + newLine) : '') +
      (this.props.campaign.objectives && this.props.campaign.objectives.kpi[1] ? ("- KPI: " + this.props.campaign.objectives.kpi[1] + ", Growth: " + this.props.campaign.objectives.growth[1] + newLine) : '') +
      (this.props.campaign.objectives && this.props.campaign.objectives.kpi[2] ? ("- KPI: " + this.props.campaign.objectives.kpi[2] + ", Growth: " + this.props.campaign.objectives.growth[2] + newLine) : '') +
      newLine +
      (this.props.campaign.targetAudience ? ("Target audience:" + newLine + this.props.campaign.targetAudience + newLine + newLine) : '') +
      (this.props.campaign.description ? ("Campaign description:" + newLine + this.props.campaign.description + newLine + newLine) : '') +
      (this.props.campaign.referenceProjects ? ("Reference projects:" + newLine + this.props.campaign.referenceProjects + newLine + newLine) : '') +
      (this.props.campaign.keywords ? ("Keywords:" + newLine + this.props.campaign.keywords + newLine + newLine) : '') +
      (this.props.campaign.additionalInformation ? ("Notes:" + newLine + this.props.campaign.additionalInformation + newLine + newLine) : '') +
      newLine +
      "Thanks!";
  }

  render() {
    const selects = {
      owner: {
        label: 'Owner',
        select: {
          name: 'owner',
          options: [
            {value: 'Other', label: 'Other'}
          ]
        }
      },
      source: {
        label: 'Source*',
        select: {
          name: 'source',
          options: Object.keys(channelsSchema.properties).map(channel => { return { value: channel, label: channelsSchema.properties[channel].title } })
        }
      },
      status: {
        label: 'Status',
        select: {
          name: 'status',
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
      },
      focus: {
        label: 'Focus',
        select: {
          name: 'focus',
          options: [
            {value: 'Acquisition', label: 'Acquisition'},
            {value: 'Activation', label: 'Activation'},
            {value: 'Retention', label: 'Retention'},
            {value: 'Revenue', label: 'Revenue'},
            {value: 'Referral', label: 'Referral'},
          ]
        }
      }
    };
    // Handle manual channels
    this.props.campaign.source.forEach(source => {
      if (!selects.source.select.options.find(item => item.value === source)) {
        selects.source.select.options.push({value: source, label: source});
      }
    });
    if (this.props.teamMembers) {
      this.props.teamMembers.forEach((member) => {
        if (member.name != '') {
          selects.owner.select.options.push({value: member.name, label: member.name});
        }
      });
    }
    selects.owner.select.options.push({value: "me", label: this.props.firstName ? this.props.firstName + " (me)" : "Me"});
    const assetsCategories = this.props.campaign.assets ?
      [...new Set(this.props.campaign.assets.map(item => item.category))]
      : [];
    const assets = assetsCategories.map((category, index) => {
      return <div key={index} className={ campaignPopupStyle.locals.categoryAssets }>
        <div className={ campaignPopupStyle.locals.assetsCategory }>
          {category}
        </div>
        <div className={ campaignPopupStyle.locals.assetsLinks }>
          { this.props.campaign.assets.filter(asset => asset.category === category)
            .map((asset, index) => <a className={ campaignPopupStyle.locals.assetsLink } key={index} href={asset.link} target="_blank">{asset.name}</a>)
          }
        </div>
      </div>
    });
    return <div>
      <div className={ this.classes.row }>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <Label>Budget</Label>
            <Textfield value={"$" + (this.props.campaign.budget ? this.props.campaign.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')} onChange={ this.handleChangeBudget.bind(this, 'budget')} style={{
              width: '166px'
            }} />
          </div>
          <div className={ this.classes.colCenter }>
            <Label>Actual Spent</Label>
            <Textfield value={"$" + (this.props.campaign.actualSpent ? this.props.campaign.actualSpent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')} onChange={ this.handleChangeBudget.bind(this, 'actualSpent')} style={{
              width: '166px'
            }} />
          </div>
          <div className={ this.classes.colRight }>
            <Select { ... selects.owner } style={{ width: '166px' }} selected={ this.props.campaign.owner } onChange= { this.handleChangeSelect.bind(this, 'owner') }/>
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <Label>Campaign Name*</Label>
        <Textfield value={ this.props.campaign.name } required={ true } onChange={ this.handleChangeText.bind(this, 'name')} ref="name" style={{ width: '665px' }}/>
      </div>
      <div className={ this.classes.row }>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <MultiSelect { ... selects.source } style={{ width: '428px' }} selected={ this.props.campaign.source } onChange= { this.handleChangeSource } ref="source"/>
          </div>
          <div className={ this.classes.colRight }>
            <Select { ... selects.status } style={{ width: '166px' }} selected={ this.props.campaign.status } onChange= { this.handleChangeSelect.bind(this, 'status') }/>
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Time</Label>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <Label>Marketing</Label>
            <Textfield value={ this.props.campaign.time && this.props.campaign.time.marketing ? this.props.campaign.time.marketing + 'h' : '' } onChange={ this.handleChangeTime.bind(this, 'marketing')} style={{
              width: '166px'
            }} />
          </div>
          <div className={ this.classes.colCenter }>
            <Label>Design</Label>
            <Textfield value={ this.props.campaign.time && this.props.campaign.time.design ? this.props.campaign.time.design + 'h' : ''  } onChange={ this.handleChangeTime.bind(this, 'design')} style={{
              width: '166px'
            }} />
          </div>
          <div className={ this.classes.colRight }>
            <Label>Development</Label>
            <Textfield value={ this.props.campaign.time && this.props.campaign.time.development ? this.props.campaign.time.development + 'h' : '' } onChange={ this.handleChangeTime.bind(this, 'development')} style={{
              width: '166px'
            }} />
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <div style={{ width: '166px' }}>
              <Label>Start Date</Label>
              <Calendar value={ this.props.campaign.startDate } onChange={ this.handleChangeDate.bind(this, 'startDate') }/>
            </div>
          </div>
          <div className={ this.classes.colCenter }>
            <div style={{ width: '166px' }}>
              <Label>Due Date</Label>
              <Calendar value={ this.props.campaign.dueDate } onChange={ this.handleChangeDate.bind(this, 'dueDate') }/>
            </div>
          </div>
          <div className={ this.classes.colRight }>
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Campaign Objectives</Label>
        <Select { ... selects.focus } selected={ this.props.campaign.focus } onChange= { this.handleChangeSelect.bind(this, 'focus') } style={{ width: '166px', marginBottom: '14px' }}/>
        <div className={ this.classes.cols }>
          <div className={ this.classes.colLeft }>
            <Label style={{
              width: '166px'
            }}>KPI</Label>
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.kpi[0] } onChange={ this.handleChangeObjectives.bind(this, 'kpi', 0)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.kpi[1] } onChange={ this.handleChangeObjectives.bind(this, 'kpi', 1)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.kpi[2] } onChange={ this.handleChangeObjectives.bind(this, 'kpi', 2)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
          </div>
          <div className={ this.classes.colCenter }>
            <Label style={{
              width: '166px'
            }}>Expected Growth</Label>
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.growth[0] } onChange={ this.handleChangeObjectives.bind(this, 'growth', 0)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.growth[1] } onChange={ this.handleChangeObjectives.bind(this, 'growth', 1)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.growth[2] } onChange={ this.handleChangeObjectives.bind(this, 'growth', 2)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
          </div>
          <div className={ this.classes.colRight }>
            <Label style={{
              width: '166px'
            }}>Actual Growth</Label>
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.actualGrowth[0] } onChange={ this.handleChangeObjectives.bind(this, 'actualGrowth', 0)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.actualGrowth[1] } onChange={ this.handleChangeObjectives.bind(this, 'actualGrowth', 1)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
            <Textfield value={ this.props.campaign.objectives && this.props.campaign.objectives.actualGrowth[2] } onChange={ this.handleChangeObjectives.bind(this, 'actualGrowth', 2)} style={{
              width: '166px',
              marginTop: '8px'
            }} />
          </div>
        </div>
      </div>
      <div className={ this.classes.row }>
        <Label>Target Audience</Label>
        <textarea value={ this.props.campaign.targetAudience } className={ campaignPopupStyle.locals.textArea } onChange={ this.handleChangeText.bind(this, 'targetAudience') }/>
      </div>
      <div className={ this.classes.row }>
        <Label>Campaign Description</Label>
        <textarea value={ this.props.campaign.description } className={ campaignPopupStyle.locals.textArea } onChange={ this.handleChangeText.bind(this, 'description') }/>
      </div>
      <div className={ this.classes.row }>
        <Label>Reference Projects</Label>
        <textarea value={ this.props.campaign.referenceProjects } className={ campaignPopupStyle.locals.textArea } onChange={ this.handleChangeText.bind(this, 'referenceProjects') }/>
      </div>
      <div className={ this.classes.row }>
        <Label>Keywords</Label>
        <textarea value={ this.props.campaign.keywords } className={ campaignPopupStyle.locals.textArea } onChange={ this.handleChangeText.bind(this, 'keywords') }/>
      </div>
      <div className={ this.classes.row }>
        <Label>Notes</Label>
        <textarea value={ this.props.campaign.additionalInformation } className={ campaignPopupStyle.locals.textArea } onChange={ this.handleChangeText.bind(this, 'additionalInformation') }/>
      </div>
      <div className={ this.classes.row }>
        <Label>Links
          <div className={ campaignPopupStyle.locals.assetsIcon } onClick={()=>{ this.setState({assetsPopup: true}) }}/>
        </Label>
        <div className={ campaignPopupStyle.locals.assetsBox }>
          { assets }
        </div>
      </div>
      <div className={ this.classes.footer } style={{ marginBottom: '1px' }}>
        <div className={ this.classes.footerLeft }>
          <Button type="normal" style={{ width: '165px' }} onClick={ this.props.openAddTemplatePopup }>Save as a template</Button>
          <Button type="warning" style={{ width: '100px', marginLeft: '30px' }} onClick={ this.archive.bind(this) }>Archive</Button>
        </div>
        <div className={ this.classes.footerRight }>
          <Button type="primary2" style={{ width: '100px', marginRight: '30px' }} onClick={ this.save }>
            <a className={ campaignPopupStyle.locals.export } href={ encodeURI("mailto:" + this.getEmailTo() + "?&subject=" + this.getEmailHeader() + "&body=" + this.getEmailBody()) } target="_blank">Export</a>
          </Button>
          <SaveButton onClick={ this.save } />
        </div>
      </div>
      <AssetsPopup hidden={ !this.state.assetsPopup } updateCampaign={ () => {this.props.updateCampaign(this.props.campaign)} } updateState={ this.props.updateState } campaign={ this.props.campaign } close={ ()=> { this.setState({assetsPopup: false}) }}/>
    </div>
  }
}