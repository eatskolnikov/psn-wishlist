var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var ui = require("sdk/ui");
var ss = require("sdk/simple-storage");

var button = ToggleButton({
  id: "btn-psn-wishlist",
  label: "PSN Wishlist",
  icon: "./icons/64.png",
  onChange: handleChange
});


var panel = panels.Panel({
  contentURL: self.data.url("popup.html"),
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
	var tab = tabs.activeTab;
	var doc = tab.window;
	if(tab.url.indexOf("https://store.playstation.com/#") == 0 && tab.url.indexOf('/games/')!=-1){
		var list = []; //$(doc).find("#list-of-items");
		var thumbnail = ''; //$(request.source).find(".productThumbImg img").attr('src');
		var platform_anchors = []; //$(request.source).find(".platformList a");

		if(typeof(ss.urls) == 'undefined'){
			ss.urls = {};
		}
		var urls = ss.urls;
		urls[tab.url] = { title:tab.title, thumbnail:thumbnail, platforms: [] };
		ss.urls = urls;
	}
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
