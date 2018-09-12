import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import Select from 'components/controls/Select';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';
import MultiSelect from 'components/controls/MultiSelect';
import CRMStyle from 'styles/indicators/crm-popup.css';

export default class HubspotAutomaticPopup extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  constructor(props) {
    super(props);
    this.state = {
      code: null,
      mapping: {
      },
      owners: [],
      hidden: true
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      serverCommunication.serverRequest('get', 'hubspotapi')
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

  open() {
    this.getAuthorization();
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
            this.getOwners(code);
          }
        }
      }, 1000);
    }
    else {
      this.getOwners();
    }
  }

  getOwners(code) {
    serverCommunication.serverRequest('post', 'hubspotapi', JSON.stringify({code: code}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.setState({owners: data, hidden: false});
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
    this.props.updateState({loading: true});
    this.close();
    serverCommunication.serverRequest('put', 'hubspotapi', JSON.stringify({mapping: this.state.mapping}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
        this.props.updateState({loading: false});
      })
      .catch(function (err) {
        this.props.updateState({loading: false});
        console.log(err);
      });
  }

  toggleCheckbox(indicator) {
    let mapping = this.state.mapping;
    if (mapping[indicator] !== undefined) {
      delete mapping[indicator];
    }
    else {
      mapping[indicator] = '';
    }
    this.setState({mapping: mapping});
  }

  toggleCheckboxMulti(key) {
    let mapping = this.state.mapping;
    if (mapping[key]) {
      delete mapping[key];
    }
    else {
      mapping[key] = [];
    }
    this.setState({mapping: mapping});
  }

  handleChange(indicator, event) {
    let mapping = this.state.mapping;
    mapping[indicator] = event.value;
    this.setState({mapping: mapping});
  }

  handleChangeMulti(key, event) {
    let mapping = this.state.mapping;
    mapping[key] = event.map((obj) => {
      return obj.value;
    });
    this.setState({mapping: mapping});
  }

  close() {
    this.setState({hidden: true});
    if (this.props.close) {
      this.props.close();
    }
  }

  render(){
    const selects = {
      tables: {
        select: {
          name: 'tables',
          options: [
            {value: 'contacts', label: 'contacts'},
            {value: 'companies', label: 'companies'}
          ]
        }
      },
      owners: {
        select: {
          name: 'owners',
          options: this.state.owners
            .map(owner => {
              return {value: owner.ownerId, label: owner.firstName + ' ' + owner.lastName + ' (' + owner.email + ')'}
            })
        }
      }
    };
    return <div style={{ width: '100%' }}>
      <div hidden={ this.state.hidden } >
        <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
          <Title title="Hubspot" subTitle="Define which stages should be taken from Hubspot"/>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.blogSubscribers !== undefined} onChange={ this.toggleCheckbox.bind(this, 'blogSubscribers') } className={ salesForceStyle.locals.label }>Blog Subscribers</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.blogSubscribers } onChange={ this.handleChange.bind(this, 'blogSubscribers') } disabled={ this.state.mapping.blogSubscribers === undefined } style={{ width: '166px'}} placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.MCL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'MCL') } className={ salesForceStyle.locals.label }>Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.MCL } onChange={ this.handleChange.bind(this, 'MCL') } disabled={ this.state.mapping.MCL === undefined } style={{ width: '166px'}} placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.MQL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'MQL') } className={ salesForceStyle.locals.label }>Marketing Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.MQL } onChange={ this.handleChange.bind(this, 'MQL') } disabled={ this.state.mapping.MQL === undefined } style={{ width: '166px'}} placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.SQL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'SQL') } className={ salesForceStyle.locals.label }>Sales Qualified Leads</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.SQL } onChange={ this.handleChange.bind(this, 'SQL') } disabled={ this.state.mapping.SQL === undefined } style={{ width: '166px'}} placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.opps !== undefined} onChange={ this.toggleCheckbox.bind(this, 'opps') } className={ salesForceStyle.locals.label }>Opportunities</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.opps } onChange={ this.handleChange.bind(this, 'opps') } disabled={ this.state.mapping.opps === undefined } style={{ width: '166px'}} placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <div className={ this.classes.cols }>
              <div className={ this.classes.colLeft } style={{ flexGrow: 'initial' }}>
                <Label checkbox={this.state.mapping.users !== undefined} onChange={ this.toggleCheckbox.bind(this, 'users') } className={ salesForceStyle.locals.label }>Paying Accounts</Label>
              </div>
              <div className={ this.classes.colCenter } style={{ flexGrow: 'initial' }}>
                <div className={ salesForceStyle.locals.arrow }/>
              </div>
              <div className={ this.classes.colRight }>
                <Select { ... selects.tables} selected={ this.state.mapping.users } onChange={ this.handleChange.bind(this, 'users') } disabled={ this.state.mapping.users === undefined } style={{ width: '166px'}}  placeholder="Group By"/>
              </div>
            </div>
          </div>
          <div className={ this.classes.row }>
            <Label checkbox={!!this.state.mapping.owners} onChange={ this.toggleCheckboxMulti.bind(this, 'owners') }>Filter by hubspot owners / regions (optional)</Label>
            <MultiSelect { ... selects.owners} selected={ this.state.mapping.owners } onChange={ this.handleChangeMulti.bind(this, 'owners') } disabled={ !this.state.mapping.owners } style={{ width: 'initial'}}  placeholder="Select your region owners"/>
          </div>
          <div className={ this.classes.footer }>
            <div className={ this.classes.footerLeft }>
              <Button type="secondary" style={{ width: '100px' }} onClick={ this.close.bind(this) }>Cancel</Button>
            </div>
            <div className={ this.classes.footerRight }>
              <Button type="primary" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
            </div>
          </div>
        </Page>
      </div>
    </div>
  }

}