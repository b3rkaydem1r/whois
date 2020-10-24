import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
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
  toggleActivityIndicator(status){
    const spinnerState = status === 'show' ? 'inline-block' : 'none';
    document.getElementsByClassName('loading')[0].style.display = spinnerState;
  }

  domain(text){
    this.setState({
      value: text
    })
    if(text.includes('.com') ||  text.includes('.net')){
      this.toggleActivityIndicator('show');
      fetch(API_URL + text)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: true}))
      this.toggleActivityIndicator('hide')
      this.setState({
        page: false
      })
    }
    else if(text.includes('.org')){
      this.toggleActivityIndicator('show');
      fetch(API_URL + text)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: false}))
      this.toggleActivityIndicator('hide');
      this.setState({
        page: false
      })
    }
  }
  onFormSubmit = e => {
    e.preventDefault()
    this.toggleActivityIndicator('show');
    if(this.state.value.includes('.com') || this.state.value.includes('.org') || this.state.value.includes('.net')){
      // Already fetched!
    }
    else{
      console.log("fetching")
      fetch(API_URL + this.state.value)
      .then(response => response.json())
      .then(data => this.setState({data: data.WhoisRecord, primary: false}))
      this.setState({
          page: false,
        })
    }
    this.toggleActivityIndicator('hide');
  }
  render() {
    const { loading } = this.state;
    return (
      <div className="container text-center mt-5">
        <h1 className="title">WhoisNET <FontAwesomeIcon icon={faNetworkWired} /></h1>
        <div className="row mt-5">
          <div className="col-md-4 col-2"/>
          <div className="innerData col-md-4 col-8">
            <form onSubmit={this.onFormSubmit}>
              <div className="form-group">
                <input
                  type="text" className="form-control" value={this.state.value}
                  onChange={(value) => this.domain(value.target.value)}
                  placeholder="domain.com"/>
                <Spinner animation="border" role="status" style={{display:'none'}} className="loading">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            </form>
          </div>
          <div className="col-md-4 col-2"/>
        </div>
        {this.state.data !== undefined ? this.state.data.dataError === undefined ?
        <div>
        <table className="table table-borderless mt-5">
          <tbody className="row">
            <tr className="col-md-6 col-12">
              <th scope="row">domainName</th>
              <td><a href={'http://' + this.state.data.domainName} target="_blank" rel="noopener noreferrer">{this.state.data.domainName}</a></td>
            </tr>
            <tr className="col-md-6 col-12">
              <th scope="row">organization</th>
              {this.state.primary ? <td>{this.state.data.registrant.organization}</td> : this.state.data.registryData.registrant.organization ? <td>{this.state.data.registryData.registrant.organization}</td> : undefined}
            </tr>
            <tr className="col-md-6 col-12">
              <th scope="row">createdDate</th>
              {this.state.primary ? <td>{this.state.data.createdDateNormalized}</td> : this.state.data.registryData.createdDateNormalized ? <td>{this.state.data.registryData.createdDateNormalized}</td> : undefined}
            </tr>
            <tr className="col-md-6 col-12">
              <th scope="row">updatedDate</th>
              {this.state.primary ? <td>{this.state.data.updatedDateNormalized}</td> : this.state.data.registryData.updatedDateNormalized ? <td>{this.state.data.registryData.updatedDateNormalized}</td> : undefined}
            </tr>
            <tr className="col-md-6 col-12">
              <th scope="row">expiresDate</th>
              {this.state.primary ? <td>{this.state.data.expiresDateNormalized}</td> : this.state.data.registryData.expiresDateNormalized ? <td>{this.state.data.registryData.expiresDateNormalized}</td> : undefined}
            </tr>
            <tr className="col-md-6 col-12">
              <th scope="row">nameServers</th>
              {this.state.primary ? <td className="nameServers">{this.state.data.nameServers.rawText}</td> : this.state.data.registryData.nameServers.rawText ? <td className="nameServers">{this.state.data.registryData.nameServers.rawText}</td> : undefined}
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
