chrome.browserAction.onClicked.addListener((currentTab) => {
  console.log("Click on button")
  chrome.tabs.sendMessage(currentTab.id, {type: "getSubtitles"}, (response) => {

    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message)
        return
    }

    const { title, subtitles } = response

    if (title && subtitles) {
      chrome.tabs.sendMessage(currentTab.id,
        {
          type: "download",
          title,
          subtitles
        }, (response) => {
          console.log("FIle downloaded")
      })

    } else {
      chrome.notifications.create("youtube2anki", {
        "type": "basic",
        "iconUrl": chrome.extension.getURL("icons/icon128.png"),
        "title": chrome.i18n.getMessage("errorTranscriptNotFoundTitle"),
        "message": chrome.i18n.getMessage("errorTranscriptNotFound")
      })
    }
  })
})

chrome.tabs.onActivated.addListener((tab) => {
  console.log("Tab changed")
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const [activeTab] = tabs
    const { url, id } = activeTab
    const re = /(http|https):\/\/(www.)?youtube\.com\\*/
    if (re.test(url)) {
      chrome.browserAction.enable(id)
    } else {
      chrome.browserAction.disable(id)
    }
  })
})
