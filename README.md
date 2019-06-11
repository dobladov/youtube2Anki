
# Youtube2Anki ![Logo](https://github.com/dobladov/youtube2Anki/raw/master/src/icons/icon48.png)

## Web Extension to convert **Youtube transcripts** to **Anki cards**.

This extension adds a star button to the transcript allowing to download the sentences as cards (csv) that can be imported into Anki, allowing to use the original audio/video of the current sentence.

![image](https://user-images.githubusercontent.com/1938043/59228047-1ea6fb00-8bd7-11e9-9da3-3b1d2df9abd6.png)

![image](https://user-images.githubusercontent.com/1938043/59226287-ebfb0380-8bd2-11e9-8f11-0ef5bd789801.png)


## Instructions

Install the extension for your prefered browser

+ [Firefox](https://addons.mozilla.org/en-US/firefox/addon/youtube2anki/)
+ [Chrome](https://chrome.google.com/webstore/detail/youtube2anki/boebbbjmbikafafhoelhdjeocceddngi)

In Anki, create a new note. Tools -> Manage Note Types

![image](https://user-images.githubusercontent.com/1938043/59226841-2a44f280-8bd4-11e9-89f4-b402e818ead8.png)

Add a new card with this fields

![image](https://user-images.githubusercontent.com/1938043/59227082-be16be80-8bd4-11e9-937f-573d73b1cf82.png)

Edit the card fields of the new note created with the correspondent code.

*Front Template*
```
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

![image](https://user-images.githubusercontent.com/1938043/59227146-ebfc0300-8bd4-11e9-84c7-2e1f6a5987ef.png)


Now after exporting the cards using the star icon next on the transcript options of the YouTube video, is possible to import the new cards using the new note type.

File -> Import 

![image](https://user-images.githubusercontent.com/1938043/59227840-958fc400-8bd6-11e9-897c-505a25c5831a.png)


## Known bugs

Navigating from video to video in YouTube will not add the star icon to the transcript, at the moment is necessary to reload the page with the current video.

This will be fixed after implementing navigation events.