var reg_name, reg_pass;
    var Client = Backbone.Model.extend({
        defaults: {
            name: null,
            pwd: null
        },
        initialize: function () {
            console.log("initialize client");
        }
    });
    var ClientsCollection = Backbone.Collection.extend({
        model: Client,
        initialize: function () {
            console.log("initialize clients collection");
            this.bind("add", function (model) { console.log("Add", model.get('id'), model); });
            this.bind("remove", function (el) { console.log("Remove", el.get('id'), el); });
        }
    });
    var ClientView = Backbone.View.extend({
        el: $("#divTwitterFeed"), /* Utilisation de zepto pour lier ClientView au DOM */
        initialize: function () {
            var that = this;
            this.listeClients = new ClientsCollection();
            this.listClients = new ClientsCollection();
            this.listeClients.bind("add", function (model) {
                that.addClientToList(model);
            });
            this.listClients.bind("add", function (model) {
                that.addLoginToList(model);
            });
        },
        events: {
            'click #cmdAddClient': 'cmdAddClient_Click',
            'click #login': 'login',
            'keyup #txtSearch': 'search_click'
        },
        cmdAddClient_Click: function () {
            var tmpClient = new Client({
                name: $("#txtIdClient").val(),
                pwd: $("#txtNomClient").val(),
            });
            this.listeClients.add(tmpClient);
        },        
        addClientToList: function (model) {
            reg_name = model.get('name');
            reg_pass = model.get('pwd');
            $("#listeClient").html("<font size=5 color=green>You are Successfully Registered, Now you can Login</font>");
        },
        addLoginToList: function (model) {;
            if (model.get('name') == reg_name && model.get('pwd') == reg_pass) {
                $("#divClientLogin").html("<font size=4 color=blue>Login sucessfull</font>");
            }
            else {
                $("#listeClient").html("<font size=5 color=green>Failed Logged in, Retry</font>");
            }
        },
        search_click: function(evt)
        {
          var searchText = $('#txtSearch') .val();
          this.fetchTwitterFeed(searchText) 
        },
        fetchTwitterFeed: function (searchText) {
            var username = reg_name;
            var password = reg_pass;
            var compositeKey = username + ":"+password;
            var basic_oauthToken = this.b64EncodeUnicode(compositeKey);
            var url;
            if(typeof searchText !== 'undefined') {
                url =  'http://localhost:4000/FetchTwitterFeed/search?q='+  searchText;   
            }
            else {
                url =  'http://localhost:4000/login/';
                
             }
            $.ajax({
                'type': 'GET',
                'headers': {'Authorization': 'Basic ' + basic_oauthToken},
                'url': url,                
                'crossDomain': 'true',
                //'data': {'method': 'getQuote','format': 'jsonp','lang': 'en'},
                'dataType': 'jsonp',
                'jsonp': 'false',
                'jsonpCallback': 'myJsonMethod',
                //'jsonpCallback': function(jsondata) {
                                    //if ( jsondata != undefined ) { console.log(jsondata)};
                //                },
                'contentType': 'application/json;charset=utf-8',
                'success': function (response) {                    
                    console.log(response);
                    //var html = this.generateTweetsHtml(response);
                    var currentTweets = response.statuses;
                    var htmlValue = '<table>';
                    currentTweets.forEach(function(tweet) {
                        htmlValue = htmlValue + '<tr><td>'+tweet.user.name+'</td></tr>'+'<tr><td>'+tweet.user.name+'</td></tr>'+'<tr><td>'+tweet.user.screen_name+'</td></tr>';
                        htmlValue = htmlValue +'<tr><td>'+tweet.text+'</td></tr>'+'<tr><td>'+tweet.retweet_count+'</td></tr>'+ '<tr><td>'+tweet.created_at+'</td></tr>';
                    });
                    htmlValue = htmlValue+'</table>';

                    $(".panel-body").html(htmlValue);
                    $("#divClientLogin").addClass('hide');
                    $(".row").removeClass('hide');                
                },
                'error': function (response) {
                    console.log(response);                    
                }
            }, this);
        },
        b64EncodeUnicode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        },
        login: function () {
            var tmplogin = new Client({
                name: $("#txtIdClient").val(),
                pwd: $("#txtNomClient").val(),
            });
            this.listClients.add(tmplogin);
            this.fetchTwitterFeed();
        },
        myJsonMethod: function(jsondata) {
            console.log(jsondata);
        },
        generateTweetsHtml: function(responseObj) {
            var currentTweets = responseObj.statuses;
            var htmlValue = '<table>';
            currentTweets.forEach(function(tweet) {
                htmlValue = htmlValue + '<tr><td>'+tweet.user.name+'</td></tr>'+'<tr><td>'+tweet.user.name+'</td></tr>'+'<tr><td>'+tweet.user.screen_name+'</td></tr>';
                htmlValue = htmlValue +'<tr><td>'+tweet.text+'</td></tr>'+'<tr><td>'+tweet.retweet_count+'</td></tr>'+ '<tr><td>'+tweet.created_at+'</td></tr>';
            });
            htmlValue = htmlValue+'</table>';
            return htmlValue;
        }



    });
    var clientView = new ClientView();
    Backbone.history.start();

