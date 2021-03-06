import React, { Component } from 'react'

import SearchList from './searchList'
import Sidebar from '@/containers/sidebar'
import wikiIcon from '@/assets/imgs/wikipedia.svg'
import { wikiFetch } from '@/assets/utils/wikiFetch'
import { debounce } from '@/assets/utils/util'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      results: [],
      isLoading: false,
      isSearchListShow: false,
      isSidebarShow: false
    }
    this.fetchDebounce = debounce(this.fetchResults, 200)
  }

  handleInputChange = event => {
    let value = event.target.value
    this.setState({ inputValue: value })
    this.fetchDebounce(value)
  }

  handleInputClick = () => {
    this.setState({ isSearchListShow: true })
  }

  handleSearchListClose = () => {
    this.setState({ isSearchListShow: false })
  }

  fetchResults = value => {
    if (value === '') {
      this.setState({ results: [] })
      return
    }
    this.setState({ isLoading: true })
      wikiFetch(value, 'search')
        .then(res => this.setState({
          results: res.query.pages || [],
          isLoading: false
        }))
        .catch(err => {
          alert(err)
        })
  }

  clearInput = () => {
    this.setState({
      inputValue: '',
      results: []
    })
  }

  handleSidebarClick = () => {
    this.setState({ isSidebarShow: true })
  }

  handleSidebarClose = () => {
    this.setState({ isSidebarShow: false })
  }

  render() {
    const { moveHeader, slot } = this.props
    const LoadingIcon = this.state.isLoading ? <i className="iconfont icon-loading"></i> : null
    const CloseIcon = this.state.inputValue ? <i className="iconfont icon-guanbi" onClick={this.clearInput}></i> : null
    const moveClass = moveHeader ? 'move' : ''

    return (
      <div className="header">
        <header className={'header-container ' + moveClass}>
          <div className="header-inner">
            <i className="iconfont icon-caidan" onClick={this.handleSidebarClick}></i>
            <img src={wikiIcon} className="wiki-icon" alt="wikipedia" width="116" height="18"></img>
            <div className="search-bar">
              <i className="iconfont icon-sousuo"></i>
              <input placeholder="搜索维基内容" value={this.state.inputValue} onChange={this.handleInputChange} onClick={this.handleInputClick}/>
              {LoadingIcon}
              {CloseIcon}
            </div>
            <div className="noop"></div>
          </div>
          <div className="header-slot">
            {slot}
          </div>
        </header>
        <SearchList results={this.state.results} show={this.state.isSearchListShow} onSearchListClose={this.handleSearchListClose}/>
        <Sidebar show={this.state.isSidebarShow} onSidebarClose={this.handleSidebarClose} />
      </div>
    )
  }
}

export default Header