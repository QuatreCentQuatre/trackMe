# TrackMe

Library that let you easily track click events with custom data. It set defaults Canadian properties too for Google 
Analytics.
---

### Version

**2.0.0**

---

### Supported Libraries

- google analytics 4
- google tag manager
---

### Getting Started

Place the **me.track.js** file in your default JavaScript vendor directory. Link the script before the end of your **
body**.

```
<script src="js/vendor/me.track.js"></script>
```

Here you go ! You're now ready to use trackMe. Here how to get started !

meTrack listens to all elements with the attribute me:track:click. Following a click event on one of those element, 
data contained in the attribute me:track:data is passed to the dataLayer.

me:track:data must contain a JSON object like the following example:

#### HTML:

~~~
<a href="#"
    me:track:click
    me:track:data='{"newData": "This is a new data", "OtherData": ["data1", "data2", "data3"]}'>
    A tracked link with data</a>
~~~

Me.Track is the instance of the meTrack object and have the following functions:

**removeEvents**: Remove click events on all me:track:click elements.

**addEvents**: Add click event on all me:track:click elements.

#### Javascript:

~~~
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('removeEvents').addEventListener('click', function () {
        Me.track.removeEvents();
    });
});
~~~