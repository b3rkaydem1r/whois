import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const API_KEY = process.env.REACT_APP_API_KEY
const API_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=' + API_KEY + '&outputFormat=json&domainName='

export default class App extends Component {
  state = {
    value: undefined,
    data: undefined,
    page: true
  }
  domain(text){
    this.setState({
      value: text
    })
    if(text.includes('.com') ||  text.includes('.net')){
      fetch(API_URL + text)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: true}))
      this.setState({
        page: false
      })
    }
    else if(text.includes('.org')){
      fetch(API_URL + text)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: false}))
      this.setState({
        page: false
      })
    }
  }
  onFormSubmit = e => {
    e.preventDefault()
    if(this.state.value.includes('.com') || this.state.value.includes('.org') || this.state.value.includes('.net')){
      // Already fetched!
    }
    else{
      fetch(API_URL + this.state.value)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: false}))
      this.setState({
        page: false
      })
    }   
  }
  render() {
    return (
      <div className="container text-center mt-5">
        <h1 className="title">WhoisNET <FontAwesomeIcon icon={faNetworkWired} /></h1>
        <div className="row mt-5">
          <div className="col-md-4 col-2"/>
          <div className="innerData col-md-4 col-8">
            <form onSubmit={this.onFormSubmit}>
              <div className="form-group">
                <input type="text" className="form-control" value={this.state.value}
                onChange={(value) => this.domain(value.target.value)} placeholder="domain.com"/>
              </div>
            </form>
          </div>
          <div className="col-md-4 col-2"/>
        </div>
        {this.state.data !== undefined ? this.state.data.dataError === undefined ?
        <div className="row">
        <table className="table table-borderless mt-5 col-md-6 col-12">
          <tbody>
            <tr>
              <th scope="row">domainName</th>
              <td><a href={'http://' + this.state.data.domainName} target="_blank" rel="noopener noreferrer">{this.state.data.domainName}</a></td>
            </tr>
            <tr>
              <th scope="row">organization</th>
              {this.state.primary ? <td>{this.state.data.registrant.organization}</td> : this.state.data.registryData.registrant.organization ? <td>{this.state.data.registryData.registrant.organization}</td> : undefined}
            </tr>
            <tr>
              <th scope="row">createdDate</th>
              {this.state.primary ? <td>{this.state.data.createdDateNormalized}</td> : this.state.data.registryData.createdDateNormalized ? <td>{this.state.data.registryData.createdDateNormalized}</td> : undefined}
            </tr>
          </tbody>
        </table>
        <table className="table table-borderless mt-md-5 col-md-6 col-12">
          <tbody>
            <tr>
              <th scope="row">updatedDate</th>
              {this.state.primary ? <td>{this.state.data.updatedDateNormalized}</td> : this.state.data.registryData.updatedDateNormalized ? <td>{this.state.data.registryData.updatedDateNormalized}</td> : undefined}
            </tr>
            <tr>
              <th scope="row">expiresDate</th>
              {this.state.primary ? <td>{this.state.data.expiresDateNormalized}</td> : this.state.data.registryData.expiresDateNormalized ? <td>{this.state.data.registryData.expiresDateNormalized}</td> : undefined}
            </tr>
            <tr>
              <th scope="row">nameServers</th>
              {this.state.primary ? <td>{this.state.data.nameServers.rawText}</td> : this.state.data.registryData.nameServers.rawText ? <td>{this.state.data.registryData.nameServers.rawText}</td> : undefined}
            </tr>
          </tbody>
        </table>
        </div>
        : <Button className="mt-4" href={"https://tr.godaddy.com/domainsearch/find?domainToCheck=" + this.state.data.domainName} variant="success" target="_blank">Buy Now</Button>  : this.state.page ? null : <p className="mt-4">No such domain name!</p>}
        <div className="my-5">
          <span className="text-muted">WhoisNET is using <a href="https://www.whoisxmlapi.com" target="_blank" rel="noopener noreferrer">whoisxmlapi.com</a> and deployed with <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></span><br/>
          <span className="text-muted">The API has 500 request limits per month. If it doesn't work, this may be the reason.</span>
        </div>
    </div>
    )
  }
}
