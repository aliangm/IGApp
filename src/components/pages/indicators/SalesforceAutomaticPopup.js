import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import MultiSelect from 'components/controls/MultiSelect';
import Select from 'components/controls/Select';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import Label from 'components/ControlsLabel';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';
import CRMStyle from 'styles/indicators/crm-popup.css';
import Textfield from 'components/controls/Textfield';
import { formatBudget } from 'components/utils/budget';

export default class SalesforceAutomaticPopup extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      stages: [],
      owners: [],
      fields: [],
      code: null,
      hidden: true,
      mapping: {
        MCL: [],
        MQL: [],
        SQL: [],
        opps : [
          "Prospecting",
          "Qualification",
          "Needs Analysis",
          "Id. Decision Makers",
          "Value Proposition",
          "Perception Analysis",
          "Proposal/Price Quote",
          "Negotiation/Review"
        ],
        users: [
          "Closed Won"
        ],
        CAC: [],
        MRR: {
          defaultMonths: 12
        }
      }
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
    if (nextProps.data && nextProps.data.mapping) {
      this.setState({mapping: nextProps.data.mapping});
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
    serverCommunication.serverRequest('post', 'salesforceapi', JSON.stringify({code: code}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({statuses: data.statuses, stages: data.stages, owners: data.owners, fields: data.fields, hidden: false});
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
    let valid = true;
    if (this.state.mapping.CAC){
      if (!this.state.mapping.CAC[0]) {
        valid = false;
        this.refs.month1.focus();
      }
      if (!this.state.mapping.CAC[1]) {
        valid = false;
        this.refs.month2.focus();
      }
      if (!this.state.mapping.CAC[2]) {
        valid = false;
        this.refs.month3.focus();
      }
    }
    if (valid) {
      serverCommunication.serverRequest('put', 'salesforceapi', JSON.stringify(this.state.mapping), localStorage.getItem('region'))
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
  }

  toggleCheckbox(indicator) {
    let mapping = this.state.mapping;
    if (mapping[indicator]) {
      delete mapping[indicator];
    }
    else {
      mapping[indicator] = [];
    }
    this.setState({mapping: mapping});
  }

  toggleCheckboxObject(indicator) {
    let mapping = this.state.mapping;
    if (mapping[indicator]) {
      delete mapping[indicator];
    }
    else {
      mapping[indicator] = {};
    }
    this.setState({mapping: mapping});
  }

  handleChange(indicator, event) {
    let mapping = this.state.mapping;
    mapping[indicator] = event.map((obj) => {
      return obj.value;
    });
    this.setState({mapping: mapping});
  }

  handleChangeCAC(index, event) {
    let mapping = this.state.mapping;
    mapping.CAC[index] = parseInt(event.target.value.replace(/[-$,]/g, ''));
    this.setState({mapping: mapping});
  }

  handleChangeField(event) {
    let mapping = this.state.mapping;
    const fieldName = event.value;
    mapping.MRR.field = fieldName;
    const fieldWithProps = this.state.fields.find(field => field.name === fieldName);
    mapping.MRR.type = fieldWithProps.type === "date" ? "date" : "number";
    this.setState({mapping: mapping});
  }

  handleChangeDefault(event) {
    let mapping = this.state.mapping;
    mapping.MRR.defaultMonths = parseInt(event.target.value) || '';
    this.setState({mapping: mapping});
  }

  close() {
    this.setState({hidden: true});
    this.props.close();
  }

  render(){
    const selects = {
      statuses: {
        select: {
          name: 'statuses',
          options: this.state.statuses
            .map(status => {
              return {value: status.Status, label: status.Status}
            })
        }
      },
      stages: {
        select: {
          name: 'stages',
          options: this.state.stages
            .map(stage => {
              return {value: stage.StageName, label: stage.StageName}
            })
        }
      },
      owners: {
        select: {
          name: 'owners',
          options: this.state.owners
            .map(owner => {
              return {value: owner.Id, label: owner.Name}
            })
        }
      },
      fields: {
        select: {
          name: 'fields',
          options: this.state.fields
            .map(field => {
              return {value: field.name, label: field.label}
            })
        }
      },
      types: {
        select: {
          name: 'types',
          options: [
            {value: 'number', label: 'number'},
            {value: 'date', label: 'date'}
          ]
        }
      },
    };
    return <div style={{ width: '100%' }}>
      <div className={ CRMStyle.locals.salesforce } onClick={ this.getAuthorization.bind(this) }/>
      <div hidden={this.state.hidden}>
        <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
          <Title title="SalesForce"
                 subTitle="Define your pipeline stages"/>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={!!this.state.mapping.MCL} onChange={ this.toggleCheckbox.bind(this, 'MCL') } className={ salesForceStyle.locals.label }>Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.MCL } onChange={ this.handleChange.bind(this, 'MCL') } disabled={ !this.state.mapping.MCL } style={{ width: '270px'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={!!this.state.mapping.MQL} onChange={ this.toggleCheckbox.bind(this, 'MQL') } className={ salesForceStyle.locals.label }>Marketing Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.MQL } onChange={ this.handleChange.bind(this, 'MQL') } disabled={ !this.state.mapping.MQL } style={{ width: '270px'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={!!this.state.mapping.SQL} onChange={ this.toggleCheckbox.bind(this, 'SQL') } className={ salesForceStyle.locals.label }>Sales Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.SQL } onChange={ this.handleChange.bind(this, 'SQL') } disabled={ !this.state.mapping.SQL } style={{ width: '270px'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={!!this.state.mapping.opps} onChange={ this.toggleCheckbox.bind(this, 'opps') } className={ salesForceStyle.locals.label }>Opportunities</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.stages} selected={ this.state.mapping.opps } onChange={ this.handleChange.bind(this, 'opps') } disabled={ !this.state.mapping.opps } style={{ width: '270px'}} placeholder="Select Opportunity Stage"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={!!this.state.mapping.users} onChange={ this.toggleCheckbox.bind(this, 'users') } className={ salesForceStyle.locals.label }>Paying Accounts</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.stages} selected={ this.state.mapping.users } onChange={ this.handleChange.bind(this, 'users') } disabled={ !this.state.mapping.users } style={{ width: '270px'}}  placeholder="Select Opportunity Stage"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <Label checkbox={!!this.state.mapping.owners} onChange={ this.toggleCheckbox.bind(this, 'owners') } className={ salesForceStyle.locals.ownersLabel }>Filter by salesforce owners / regions (optional)</Label>
            <MultiSelect { ... selects.owners} selected={ this.state.mapping.owners } onChange={ this.handleChange.bind(this, 'owners') } disabled={ !this.state.mapping.owners } style={{ width: 'initial'}}  placeholder="Select your region owners"/>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.row }>
              <Label checkbox={this.state.mapping.MRR !== undefined} onChange={ this.toggleCheckboxObject.bind(this, 'MRR') } className={ salesForceStyle.locals.label }>Calculate MRR</Label>
            </div>
            <div hidden={this.state.mapping.MRR === undefined}>
              <div className={ this.classes.row }>
                <div className={ this.classes.cols }>
                  <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                    <Label className={ salesForceStyle.locals.label }>Default licensing period (months)</Label>
                  </div>
                  <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                    <div className={ salesForceStyle.locals.arrow }/>
                  </div>
                  <div className={ this.classes.colRight }>
                    <Textfield value={ this.state.mapping.MRR && this.state.mapping.MRR.defaultMonths } onChange={ this.handleChangeDefault.bind(this) } style={{ width: '270px'}}/>
                  </div>
                </div>
              </div>
              <div className={ this.classes.row }>
                <div className={ this.classes.cols }>
                  <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                    <Label className={ salesForceStyle.locals.label } question={['']}
                           description={['* If relevant, which custom field indicates how the amount of each deal should be divided. Choose a number (each deal amount will be divided by this number, which indicates # of months per deal) or a date (the amount will be divided to all months between close date and this date).']}>Divide deal amounts by</Label>
                  </div>
                  <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                    <div className={ salesForceStyle.locals.arrow }/>
                  </div>
                  <div className={ this.classes.colRight }>
                    <Select { ... selects.fields } selected={ this.state.mapping.MRR && this.state.mapping.MRR.field }
                            onChange={ this.handleChangeField.bind(this) } style={{ width: '270px'}} placeholder="choose if relevant"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={ this.classes.row } hidden={this.props.data && this.props.data.isCACAuto}>
            <Label checkbox={!!this.state.mapping.CAC} onChange={ this.toggleCheckbox.bind(this, 'CAC') } className={ salesForceStyle.locals.label }>Calculate CAC</Label>
            <div hidden={!this.state.mapping.CAC}>
              <div className={ this.classes.row }>
                How much did you invest on all marketing activities over the last 3 months?
              </div>
              <div className={ this.classes.row }>
                <div className={ this.classes.cols }>
                  <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                    <Label className={ salesForceStyle.locals.label }>3 months ago</Label>
                  </div>
                  <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                    <div className={ salesForceStyle.locals.arrow }/>
                  </div>
                  <div className={ this.classes.colRight }>
                    <Textfield value={ "$" + (formatBudget(this.state.mapping.CAC && this.state.mapping.CAC[0]) || '') } onChange={ this.handleChangeCAC.bind(this, 0) } ref="month1"/>
                  </div>
                </div>
              </div>
              <div className={ this.classes.row }>
                <div className={ this.classes.cols }>
                  <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                    <Label className={ salesForceStyle.locals.label }>2 months ago</Label>
                  </div>
                  <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                    <div className={ salesForceStyle.locals.arrow }/>
                  </div>
                  <div className={ this.classes.colRight }>
                    <Textfield value={ "$" + (formatBudget(this.state.mapping.CAC && this.state.mapping.CAC[1]) || '') } onChange={ this.handleChangeCAC.bind(this, 1) } ref="month2"/>
                  </div>
                </div>
              </div>
              <div className={ this.classes.row }>
                <div className={ this.classes.cols }>
                  <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                    <Label className={ salesForceStyle.locals.label }>last month</Label>
                  </div>
                  <div className={ this.classes.colCenter } style={{ flexGrow: 'initial', margin: 'initial' }}>
                    <div className={ salesForceStyle.locals.arrow }/>
                  </div>
                  <div className={ this.classes.colRight }>
                    <Textfield value={ "$" + (formatBudget(this.state.mapping.CAC && this.state.mapping.CAC[2]) || '') } onChange={ this.handleChangeCAC.bind(this, 2) } ref="month3"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={ this.classes.footer }>
            <div className={ this.classes.footerLeft }>
              <Button type="normal" style={{ width: '100px' }} onClick={ this.close.bind(this) }>Cancel</Button>
            </div>
            <div className={ this.classes.footerRight }>
              <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
            </div>
          </div>
        </Page>
      </div>
    </div>
  }

}