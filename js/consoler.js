function consolerClass() {

	var ini = this;

	this.manual = function(txt, clr, bg, add) {
		var text = txt || "";
		var color = clr || "#333";
		var bgcolor = bg || "#ffffff";
		var additional = add || "";

		console.log('%c' + text, 'background: ' + bgcolor + '; color: ' + color + ";" + add);
	}
	this.t = function(txt) {
		ini.manual(txt, "#000000");
	}
	this.blue = function(txt) {
		ini.manual(txt, "blue", "#FFFFFF");
	}
	this.red = function(txt) {
		ini.manual(txt, "red", "#FFFFFF");
	}
	this.green = function(txt) {
		ini.manual(txt, "green", "#FFFFFF");
	}

	this.caption = function (cap, txt) {
		console.log(cap + ' : %c' + txt, 'color: blue; font-weight: bold;');
	}

	this.w = function(txt) {
		ini.manual(txt, "red", "#FFFFFF", "font-weight: bold;");
	}
	this.err = function(txt) {
		ini.manual(txt, "#FFFFFF", "red", "font-weight: bold;");
	}
}
var consoler = new consolerClass();


function toTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}