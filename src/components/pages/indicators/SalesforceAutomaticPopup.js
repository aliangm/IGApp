import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import MultiSelect from 'components/controls/MultiSelect';
import style from 'styles/onboarding/onboarding.css';
import Button from 'components/controls/Button';
import serverCommunication from 'data/serverCommunication';
import Label from 'components/ControlsLabel';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Title from 'components/onboarding/Title';

export default class SalesforceAutomaticPopup extends Component {

  style = style;
  styles = [salesForceStyle];

  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      stages: [],
      owners: [],
      code: null,
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
        ]
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden && this.props.hidden != nextProps.hidden) {
      serverCommunication.serverRequest('get', 'salesforceapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                const win = window.open(data);

                const timer = setInterval(() => {
                  if (win.closed) {
                    clearInterval(timer);
                    const code = localStorage.getItem('code');
                    if (code) {
                      localStorage.removeItem('code');
                      this.setState({code: code});
                      serverCommunication.serverRequest('post', 'salesforceapi', JSON.stringify({code: code}), localStorage.getItem('region'))
                        .then((response) => {
                          if (response.ok) {
                            response.json()
                              .then((data) => {
                                this.setState({statuses: data.statuses, stages: data.stages, owners: data.owners});
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
                }, 1000);

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

  getUserData() {
    serverCommunication.serverRequest('put', 'salesforceapi', JSON.stringify(this.state.mapping), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
              this.props.close();
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

  handleChange(indicator, event) {
    let mapping = this.state.mapping;
    mapping[indicator] = event.map((obj) => {
      return obj.value;
    });
    this.setState({mapping: mapping});
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
      }
    };
    return <div hidden={ this.props.hidden }>
      {this.state.code ?
        <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
          <Title title="SalesForce"
                 subTitle="Define your pipeline stages"/>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft }>
                <Label checkbox={!!this.state.mapping.MCL} onChange={ this.toggleCheckbox.bind(this, 'MCL') } className={ salesForceStyle.locals.label }>Leads</Label>
              </div>
              <div className={ this.classes.colCenter }>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.MCL } onChange={ this.handleChange.bind(this, 'MCL') } disabled={ !this.state.mapping.MCL } style={{ width: 'initial'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft }>
                <Label checkbox={!!this.state.mapping.MQL} onChange={ this.toggleCheckbox.bind(this, 'MQL') } className={ salesForceStyle.locals.label }>Marketing Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter }>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.MQL } onChange={ this.handleChange.bind(this, 'MQL') } disabled={ !this.state.mapping.MQL } style={{ width: 'initial'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft }>
                <Label checkbox={!!this.state.mapping.SQL} onChange={ this.toggleCheckbox.bind(this, 'SQL') } className={ salesForceStyle.locals.label }>Sales Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter }>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.statuses} selected={ this.state.mapping.SQL } onChange={ this.handleChange.bind(this, 'SQL') } disabled={ !this.state.mapping.SQL } style={{ width: 'initial'}} placeholder="Select Lead Status"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft }>
                <Label checkbox={!!this.state.mapping.opps} onChange={ this.toggleCheckbox.bind(this, 'opps') } className={ salesForceStyle.locals.label }>Opportunities</Label>
              </div>
              <div className={ this.classes.colCenter }>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.stages} selected={ this.state.mapping.opps } onChange={ this.handleChange.bind(this, 'opps') } disabled={ !this.state.mapping.opps } style={{ width: 'initial'}} placeholder="Select Opportunity Stage"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft }>
                <Label checkbox={!!this.state.mapping.users} onChange={ this.toggleCheckbox.bind(this, 'users') } className={ salesForceStyle.locals.label }>Paying Accounts</Label>
              </div>
              <div className={ this.classes.colCenter }>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <MultiSelect { ... selects.stages} selected={ this.state.mapping.users } onChange={ this.handleChange.bind(this, 'users') } disabled={ !this.state.mapping.users } style={{ width: 'initial'}}  placeholder="Select Opportunity Stage"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <Label checkbox={!!this.state.mapping.owners} onChange={ this.toggleCheckbox.bind(this, 'owners') } className={ salesForceStyle.locals.ownersLabel }>Group by salesforce owners / regions (optional)</Label>
            <MultiSelect { ... selects.owners} selected={ this.state.mapping.owners } onChange={ this.handleChange.bind(this, 'owners') } disabled={ !this.state.mapping.owners } style={{ width: 'initial'}}  placeholder="Select your region owners"/>
          </div>
          <div className={ this.classes.footer }>
            <div className={ this.classes.footerLeft }>
              <Button type="normal" style={{ width: '100px' }} onClick={ this.props.close }>Cancel</Button>
            </div>
            <div className={ this.classes.footerRight }>
              <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
            </div>
          </div>
        </Page>
        : null }
    </div>
  }

}