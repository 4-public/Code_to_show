
/* Cross domain requests security */
(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();


//=============================================================

/* Request to other domain */
function getXml(url, callback){
  var req = new XMLHttpRequest();

  req.open("GET", url);
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var type = req.getResponseHeader("Content-Type");
      var cors = req.getResponseHeader("Access-Control-Allow-Origin");
      if (type.match(/^text\/xml/))
        callback(req.responseXML);
    }
  }
  req.send();

};


//=============================================================

/* Callback for request */
var includeNews = function (response){
  var itemsList = response.getElementsByTagName('item');
  var tagIs = function(tag, itemNo){
    var t = itemsList[i].getElementsByTagName(tag)[0].firstChild.nodeValue;
    return t;
  };
  var cutDescr = function(tag, itemNo){// Making short version of article for inpage preview
    var short = tagIs(tag, itemNo).replace(/<a.*?">/g,"").replace(/<\/a>/g,"").substring(0, 190).replace(/<\/?(ul|li)>/g,"").replace(/Continue\sreading...$/,"").replace(/\s\w*$/,"...");
    return short;
  };

  var random = Math.floor(Math.random() * 20 + 3);// Setting 'random' var. to get different news from parsed array (itemsList) each request.
  for (var i = random, length = i + 3; i < length; i++) {
    var outputToPrev = '';
    var outputToPopup = '';
    var item = {// Parsed article elements
      title: tagIs("title", i),
      descr: tagIs("description", i),
      descrCutted: cutDescr("description", i),
      date: tagIs("pubDate", i).substring(5,22).replace(" ", "/").replace(" ", "/")
    };
    outputToPrev += '<div class="news-article">\n<span class="news-article-date">' +
              item.date +
              '</span>\n<H2>' +
              item.title +
              '</h2>\n<p>' +
              item.descrCutted +
              '</p>\n</div>';
    outputToPopup += '\n<span class="news-article-date">' +
              item.date +
              '</span>\n<H2>' +
              item.title +
              '</h2>\n<p>' +
              item.descr +
              '</p>';
    document.getElementById("popup-input-"+(length-i)).nextSibling.nextSibling.innerHTML = outputToPrev;
    document.getElementsByClassName('popup-window-main')[(length-i-1)].innerHTML = outputToPopup;
  };
  console.log(new Date().toLocaleTimeString());

};

//=============================================================

/* Updating news each appointed time interval */
function oneMinuteReload(){
  setTimeout(getXml, 0, "http://www.theguardian.com/uk/rss", includeNews);
  var interval = setInterval(getXml, 60000, "http://www.theguardian.com/uk/rss", includeNews);
  var clear = function(){
    clearInterval(interval);
    console.log("Reloading finished.");
  };
  //setTimeout(clear, 1000);
  window.addEventListener("beforeunload", clear, false);
}

oneMinuteReload();

//=============================================================
