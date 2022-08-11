[![Firefox](https://img.shields.io/amo/v/youtube2anki.svg?label=Firefox)](https://addons.mozilla.org/en-US/firefox/addon/youtube2anki/)
[![Chrome](https://img.shields.io/chrome-web-store/v/boebbbjmbikafafhoelhdjeocceddngi.svg?color=%234A88EE&label=Chrome)](https://chrome.google.com/webstore/detail/youtube2anki/boebbbjmbikafafhoelhdjeocceddngi)
[![License](https://img.shields.io/github/license/dobladov/youtube2anki.svg?color=%23B70000)](https://github.com/dobladov/youtube2Anki/blob/master/LICENSE)
[![PayPal](https://img.shields.io/badge/Support%20this%20project-PayPal-009CDE.svg)](https://www.paypal.com/donate/?hosted_button_id=Z4D6849QVUXD2)

# Youtube2Anki ![Logo](https://github.com/dobladov/youtube2Anki/raw/master/src/icons/icon48.png)

## Web Extension to convert **Youtube transcripts** to **Anki cards**.

> :warning: If AnkiConnect does not work add "*" to your AnkiConnect configuration in Anki -> Tools -> Add-ons -> AnkiConnect -> Config.

```javascript
"webCorsOriginList": [
    "*",
    "http://localhost"
]
```

This extension allows to download the transcript of a YouTube video to a csv that can be imported into Anki or directly send the cards to Anki using AnkiConnect, allowing to use the original audio/video of the current sentence and without having to download the original media.

![example](https://user-images.githubusercontent.com/1938043/60365436-00b80380-99e9-11e9-8524-02916a2619a9.gif)

![Anki Card](https://user-images.githubusercontent.com/1938043/59226287-ebfb0380-8bd2-11e9-8f11-0ef5bd789801.png)


## Install

Install the extension for your prefered browser

+ [Firefox](https://addons.mozilla.org/en-US/firefox/addon/youtube2anki/)
+ [Chrome](https://chrome.google.com/webstore/detail/youtube2anki/boebbbjmbikafafhoelhdjeocceddngi)

## Send to Anki [AnkiConnect]

Install [AnkiConnect]("https://ankiweb.net/shared/info/2055492159") to add the cards directly to a deck, once the plugin is installed, keep Anki open and press the `Send` button from the extension.

There is no need for the following steps.

## Instructions for export CSV

In Anki, create a new note. Tools -> Manage Note Types

![Manage Notes](https://user-images.githubusercontent.com/1938043/59226841-2a44f280-8bd4-11e9-89f4-b402e818ead8.png)

Add a new card with this fields

![Note Fields](https://user-images.githubusercontent.com/1938043/60300182-b7a37900-992e-11e9-9fe1-3979ab2b6328.png)

Edit the card fields of the new note created with the correspondent code.

*Front Template*
```
{{title}}
<br>

<span>{{prevText}}</span>
<br>

{{text}}
<br>

<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/{{id}}?start={{startSeconds}}&end={{endSeconds}}&autoplay=1"
    frameborder=0
       autoplay=1
/>

<br>
<span>{{time}} - {{nextTime}}</span>
<br>
<span>{{nextText}}</span>
```

*Styling*
```
.card {
 font-family: futura-pt,sans-serif,sans-serif;
 font-size: 20px;
 text-align: center;
 color: black;
 background-color: #e9e9e9;
}

span {
 font-size: 0.9rem;
 color: #3c3c3c;
}

```
*Back Template*
```
{{FrontSide}}

<hr id=answer>
```

![Card Template](https://user-images.githubusercontent.com/1938043/60300373-254fa500-992f-11e9-8171-85ece52f63cf.png)


Now after exporting the cards using by using the extension icon, is possible to import the new cards using the new note type.

> **Please be sure to open the transcript of the video before pressing the export button**, since the transcript is not created until the user opens it, this step is required.

File -> Import

![Import](https://user-images.githubusercontent.com/1938043/59227840-958fc400-8bd6-11e9-897c-505a25c5831a.png)
