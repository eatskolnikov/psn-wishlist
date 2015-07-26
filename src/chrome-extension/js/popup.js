function getCurrentTab(callback) {
  var queryInfo = { active: true, currentWindow: true };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(tab);
  });
}
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}
function removeItem(data){
	$("#"+data.idx).hide("slow");
	chrome.storage.sync.get(null, function(items){
		if(typeof(items.urls) == 'undefined'){
			items.urls = {};
		}
		var urls = items.urls;
		delete urls[data.url];
    	chrome.storage.sync.set({urls:urls}, function() {
    		showList(urls);
			renderStatus('');
		});
    });
};

function showList(urls){
	$("#list-of-items").html('');
	var idx = 0;
	for(var url in urls){
		idx = idx+1;
		var platforms = "<br/>";
		$(urls[url].platforms).each(function(){
			platforms = platforms + "<small><b>&nbsp;"+this+"&nbsp;</b></small>";
		});
		var item_thumbnail = $("<td style='width:64px'><img src='"+urls[url].thumbnail+"' style='width:100%'/></td>");
		var item_anchor = $("<td style='width:326px'><a target='_blank' href='"+url+"'>"+urls[url].title+"</a>"+platforms+"</td>");
		var anchor_remove = $("<a class='btn-remove btn btn-danger' data-url='"+url+"' data-idx='"+idx+"' ><i class='glyphicon glyphicon-remove'></i></a>").on("click", function(e){
			if(confirm("Are you sure you want to remove this item?")){
				removeItem($(e.currentTarget).data());
			}
		});
		var item_remove = $("<td>").append(anchor_remove);
		var item_row = $("<tr>").append(item_thumbnail).append(item_anchor).append(item_remove);
		var item_table = $("<table>").append(item_row);
		var item_list = $("<li id='"+idx+"' class='list-group-item'>").append(item_table);
		$("#list-of-items").append(item_list);
	}
	if(idx == 0){ $("#list-of-items").html('<h4 class="text-center">Your wishlist is empty.</h4>'); }
}

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		getCurrentTab(function(tab) {
			if(tab.url.indexOf("https://store.playstation.com/#") == 0 && tab.url.indexOf('/games/')!=-1){
				var list = document.getElementById("list-of-items");
				var thumbnail = $(request.source).find(".productThumbImg img").attr('src');
				var platform_anchors = $(request.source).find(".platformList a");
				chrome.storage.sync.get(null, function(items){
					if(typeof(items.urls) == 'undefined'){
						items.urls = {};
					}
					var urls = items.urls;
					urls[tab.url] = { title:tab.title, thumbnail:thumbnail, platforms: [] };
					platform_anchors.each(function(){
						urls[tab.url].platforms.push($(this).text()); 
					});
		        	chrome.storage.sync.set({urls:urls}, function() {
		        		showList(urls);
					});
		        });
			}else{
				chrome.storage.sync.get(null, function(items){
					if(typeof(items.urls) == 'undefined'){ items.urls = {}; }
					showList(items.urls);
				});
			}
		});
	}
});

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.executeScript(null, { file: "js/getPagesSource.js" });
});