const enableDisableTab = (id, url) => {
  const re = /(http|https):\/\/(www.)?youtube\.com\\*/
  if (re.test(url)) {
    chrome.browserAction.enable(id)
  } else {
    chrome.browserAction.disable(id)
  }
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const [activeTab] = tabs
    const { url, id } = activeTab
    enableDisableTab(id, url)
  })
})

chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.status == "complete") {  
      enableDisableTab(id, tab.url)
    }
})