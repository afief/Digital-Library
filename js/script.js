$(function() {

	var con = consoler;
	var data;
	var elBookList = $("#booklist");
    
    var apiUrl = "http://risettekpend.org/digitallibrary/api/";

	var page = -1;

	var user = {
		name: localStorage.getItem("name") || "",
		username: localStorage.getItem("username") || "",
		password: localStorage.getItem("password") || "",
		email: localStorage.getItem("email") || "",
		get isLoggedIn() {
            var result = localStorage.getItem("isLoggedIn");
            consoler.caption("is logged in", result);
			return result;
		}
	}

	$("#login_login").bind("click", login);

	$("#stream").on("pagebeforeshow", onStreamPage);
	$("#add_book").on("pagebeforeshow", addAddBookPage);
	$("#add_user").on("pagebeforeshow", addUserPage);
    $("#admin_panel").on("pagebeforeshow", administratorPage);
    $("#logout").on("pagebeforeshow", logoutPage);

    $("#contact").on("pagebeforeshow", contactPage);
    function contactPage() {
    	$("#contact iframe").attr("src", $("#contact iframe").attr("src"));
    }

	function onStreamPage() {
		if (elBookList.children().length <= 0) {
			consoler.blue("books from stream");
			loadBook();
		}
	}
	function loadBook() {
		page++;
		consoler.caption("stream page", page);

		$.mobile.loading("show");
		$.ajax({
			url: apiUrl + "list.php",
			type: "GET",
			data: {p: page, l: 10, r: Math.random()},
			dataType: 'json',
			success: onSuccess,
			error: onError
		});
		function onSuccess(d) {
			data = d;

			if (data.length > 0) {
				consoler.caption("judul pertama baru", data[0].judul);

				var li;
				for (var i = 0; i < data.length; i++) {
					li = $("<li></li>");
					li.append("<a href='#'><h2>" + toTitleCase(data[i].judul) + "</h2><p><i>" + (data[i].publisher?data[i].publisher:'') + "</i></p></a>");
					li.attr({
						index: i
					});
					elBookList.append(li);
					li.click(bookOnClick);
				}
				//consoler.err($.mobile.activePage.attr('id'));
				if ($.mobile.activePage.attr('id') == "stream") {
					elBookList.listview('refresh');
				}
			}
			$.mobile.loading("hide");
			con.caption("books length update", elBookList.children().length.toString());
		}
		function onError() {
			$.mobile.loading("hide");
			console.log("Error Detected");
		}
		function bookOnClick(e) {
			var index = $(e.currentTarget).attr('index');
			console.log(data[index]);

			$(".book_title").html(data[index].judul);
			$(".book_edition").html(data[index].edisi);
			$(".book_series").html(data[index].judul_seri);
			$(".book_publisher").html(data[index].publisher);
			$(".book_publishyear").html(data[index].publish_year);
			$(".book_publishplace").html(data[index].publish_place);	
			$(".book_isbn").html(data[index].isbn);

			$.mobile.changePage("#book");
		}
	}
	

	function addAddBookPage() {
		if (user.isLoggedIn) {
			consoler.green("Add Book Page");
            
            $("#tambah_tambah").unbind("click").bind("click", addBook);
		} else {
			$.mobile.changePage("#login");
		}
        function addBook() {
            $.ajax({
    			url: apiUrl + 'tambah_buku.php',
    			type: 'POST',
    			dataType: 'json',
    			data: {
                    username    : user.username,
                    password    : user.password,
    				judul       : $("#tambah_judul").val(),
                    keterangan  : $("#tambah_keterangan").val(),
                    penerbit    : $("#tambah_penerbit").val(),
                    kota        : $("#tambah_kota").val(),
                    edisi       : $("#tambah_edisi").val(),
                    tahun       : $("#tambah_tahun").val(),
                    bahasa      : $("#tambah_bahasa").val(),
                    isbn        : $("#tambah_isbn").val(),
                    bentuk      : $("#tambah_bentuk").val(),
	    		}
    		})
    		.done(function(e) {
    			console.log("done");
    		})
    		.fail(function() {
    			alert("Terjadi Kesalahan Ketika Menambah Buku");
    		})
    		.always(function(e) {
    			console.log("complete", e);
    
    			if (e.status) { //jika login informasi benar    
    				$.mobile.changePage("#admin_panel");
    			}
		    });
        }
	}
	function addUserPage() {
		if (user.isLoggedIn) {
			consoler.green("Add User Page");

			$("#userform").submit(addUser);
		} else {
			$.mobile.changePage("#login");
		}
		function addUser(e) {
			e.preventDefault();

			var formData = new FormData($("#userform")[0]);
			$.ajax({
    			url: apiUrl + 'tambah_user.php',
    			type: 'POST',
    			dataType: 'json',
    			data: formData,
    			cache: false,
				contentType: false,
				processData: false
    		})
    		.done(function(e) {
    			console.log("done");
    		})
    		.fail(function() {
    			alert("Terjadi Kesalahan Ketika Menambah User");
    		})
    		.always(function(e) {
    			console.log("complete", e);
    
    			if (e.status) { //jika login informasi benar    
    				$.mobile.changePage("#admin_panel");
    			}
		    });
		}
	}

    function administratorPage() {
        if (user.isLoggedIn) {
            consoler.green("Administrator Page");
        } else {
            $.mobile.changePage("#login");
        }
    }

	function login() {
		var username = $("#login_username").val();
		var password = $("#login_password").val();

		consoler.green("login : " + username + " :: " + password);

		$.ajax({
			url: apiUrl + 'login.php',
			type: 'POST',
			dataType: 'json',
			data: {
				username: username,
				password: password
			}
		})
		.done(function(e) {
			console.log("done");
		})
		.fail(function() {
			alert("Username / Password Salah");
		})
		.always(function(e) {
			console.log("complete", e);

			if (e.status) { //jika login informasi benar
				localStorage.setItem("username", username);
				localStorage.setItem("password", password);
				localStorage.setItem("name", e.data.nama);
				localStorage.setItem("email", e.data.email);
				localStorage.setItem("isLoggedIn", true);
                
                user.username = e.data.username;
                user.password = password;
                user.name = e.data.name;
                user.email = e.data.email;

				$.mobile.changePage("#admin_panel");
			}
		});	
	}
    function logoutPage() {
        localStorage.removeItem("username");
		localStorage.removeItem("password");
		localStorage.removeItem("name");
		localStorage.removeItem("email");
		localStorage.removeItem("isLoggedIn");
        
        consoler.red("LOGOUT");
        
        $.mobile.changePage("#home");
    }

	/* STORAGE */

	$(document).on("scrollstop",function(){
		//consoler.caption("scroll by height", ($(window).scrollTop() + $(window).height()) + " : " + elBookList.height().toString());
		if (($(window).scrollTop() + $(window).height()) >= elBookList.height()) {
			loadBook();
		}
		//con.caption("scroll top", $(window).scrollTop() + "-" + $(window).height() + "-" + elBookList.height());
	});


	/* ON Resize */
	function onResize() {
		$("#container").width($("#container").height() * 480 / 800);
	}
	window.addEventListener("resize", onResize);
	onResize();
});