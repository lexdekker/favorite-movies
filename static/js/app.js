// NameSpace of Module pattern
var appCMD = appCMD || {};

// Self Invoking Anonymous Function
(function(){

	appCMD.controller = {
		init: function(){
			appCMD.config.init();
			appCMD.router.init();
			appCMD.sections.init();
			appCMD.gestures.init();
		}
	}

	appCMD.router = {

		init: function() {
			// Routie checks de link after # to see what needs to run.
			routie({
			    '/about': function() {
			    	console.log("About");
					appCMD.sections.toggle("about");
			    },
			    '/movies': function() {
			    	console.log("Movies");
					appCMD.sections.movies();
			    },
                '/movies/genre/:genre':function(genre){
                    console.log("Genre: " + genre);
                    appCMD.sections.moviesByGenre(genre);
                },
                '/movies/:id': function(id){
                    console.log("Detailpage movie: " + id);
                    appCMD.sections.movieDetail(id);
                },
                '*': function() {
                    console.log("Default: About");
					appCMD.sections.toggle("about");
                }
                
			});
		}

	}

	appCMD.skeleton = {

		about: {
			title: "About this app",
			description: [
				{
					paragraph: "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all."
				},
				{
					paragraph: "I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks."
				},
				{
					paragraph: "Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy."
				},
				{
					paragraph: "That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world."
				}
			]
		},

		movieReviews: {},

		movies: {},
	}
    
	appCMD.sections = {

		init: function() {
            appCMD.reviews.average();
			this.about();
			this.movies();
			this.toggle();
			
		},

		about: function() {
			appCMD.utility.hideAllSections();
            Transparency.render(document.getElementById('about'), appCMD.skeleton.about);
		},

		movies: function() {
			appCMD.utility.hideAllSections();
            var self = this;

			// Movies
            document.getElementById('movies').classList.add('active');
           	
			if(localStorage.getItem('films')){
				Transparency.render(document.getElementById('movies'), appCMD.skeleton.movies, appCMD.config.directives);
			}
			else{
				appCMD.config.xhr.trigger("GET", "http://dennistel.nl/movies", self.moviesSucces, "JSON");
			}

		},

		moviesSucces: function(text) {
            appCMD.utility.hideAllSections();
			appCMD.skeleton.movies = JSON.parse(text);
			console.log('Parsed data', JSON.parse(text));
			console.log('Data from data object', appCMD.skeleton.movies);

			Transparency.render(document.getElementById('movies'), appCMD.skeleton.movies, appCMD.config.directives);

			localStorage.setItem('films', text);
		},
        
        moviesByGenre:function(genre){
            appCMD.utility.hideAllSections();
            document.getElementById('movies').classList.add('active');
            
            var movies = appCMD.skeleton.movies;
            
            // Looks through each value in the movies, returning an array of all the values that pass a truth test
            var filteredMovies = _.filter(movies, function(movie){
                for(var i=0; i<movie.genres.length; i++){
                    if(movie.genres[i] == genre) return true;
                }
                return false;
            });
            
            Transparency.render(document.getElementById('movies'), filteredMovies, appCMD.config.directives);
        },
        
        movieDetail: function(id){
            appCMD.utility.hideAllSections();
            
            var movies = appCMD.skeleton.movies;
            
            // Makes a Int of a string
            id = parseInt(id);
            
            // _.findWhere search through the movie array to find the id. When it finds the id it returns the movie with the id it found
            var movie = _.findWhere(movies, {id: id});
            
            document.getElementById('detail').classList.add('active');
            Transparency.render(document.getElementById('detail'), movie, appCMD.config.directives);
        },

		toggle: function(section) {
			if (section == "about") {
				appCMD.utility.hideAllSections();
				document.querySelector('#about').classList.add('active');
			} 
			else if (section == "movies") {
				appCMD.utility.hideAllSections();
				document.querySelector('#movies').classList.add('active');
			} 
			else {
				appCMD.utility.hideAllSections();
				document.querySelector('#about').classList.add('active');
			}
		}

	}

	appCMD.reviews =  {
		// Method average calculates the average score of the reviews on each movie.
        average: function() {
            console.log("manipulate review scores");

            // get data
            var data = JSON.parse(localStorage.getItem('films'));

            // _.map == Produces a new array and fills this with the movies
            _.map(data, function (movie, i) {
            		// _.reduce == Reduces down a list of values into a single value.
                    movie.reviews = _.reduce(movie.reviews,   function(memo, review){ return memo + review.score; }, 0) / movie.reviews.length;

            console.log(movie.reviews)
            return movie;
            })  
        appCMD.skeleton.movies = data;
        console.log(appCMD.skeleton.movies)
        return data;
     
    	}
    }

	appCMD.gestures = {
		init: function() {
			this.genreFilter();
		},

		// genreFilter adds a gesture and animations on swipe
		genreFilter: function() {
			var movies = document.getElementsByClassName('genre-filter')[0];

			// by default, it only adds horizontal recognizers
			var mc = new Hammer(movies);

			var panFilter = document.getElementById('pan-filter');
			var slideMenuIcon = document.getElementById('menu-icon');

			panFilter.classList.add('panRight');

			mc.on("panleft", function(ev) {
			    panFilter.classList.remove('panRight');
			    panFilter.classList.add('panLeft');

			    slideMenuIcon.classList.remove('slideOut');
			    slideMenuIcon.classList.add('slideIn');

			});

			mc.on("panright", function(ev) {
			    panFilter.classList.remove('panLeft');
			    panFilter.classList.add('panRight');

			    slideMenuIcon.classList.remove('slideIn');
			    slideMenuIcon.classList.add('slideOut');
			});
		}
	}
    
	appCMD.config = {
		init: function() {
            this.transparency();
        },

        // Custom binding name
        transparency: function() {
            Transparency.matcher = function(element, key) {
                return element.el.getAttribute('data-name') == key;
            };
        },

		directives: {
			cover: {
			    src: function(params) {
			      	return this.cover;
			    },
			    alt: function() {
			    	return this.title + ' cover';
			    }
		  	},
            
            readMore: {
                href: function(params) {
                    return '#/movies/' + this.id;
                }
            },

            genres: { 
                genre: {
                    href: function() {
                        return "#/movies/genre/" + this.value;
                    },
                    text: function() {
                        return this.value;
                    }
                }
            },

            reviews: {
				text: function(){
					if(isNaN(this.reviews)){
						return 'No score';
					}
					else {
						return this.reviews;
					}
				}
			},

            actors: {
                url_photo: {
                    src: function(params) {
                        return this.url_photo;
                    },
                    alt: function() {
                    	if (this.title != undefined){
                    		return this.title + ' cover';
                    	} 
                    	else {
                    		return 'Photo of actor';
                    	}
				    }
                },
                url_character: {
                    text: function(params) {
                        return params.value;
                    },
                    href: function(params) {
                        return this.url_character;
                    }
                },
                url_profile: {
                    text: function(params) {
                        return params.value;
                    },
                    href: function(params) {
                        return this.url_profile;
                    }
                }
            }
            
		},

		xhr: {
			trigger: function (type, url, success, data) {
				var req = new XMLHttpRequest;
				
				req.open(type, url, true);

				req.setRequestHeader('Content-type','application/json');

				type === 'POST' ? req.send(data) : req.send(null);

				req.onreadystatechange = function() {
					if (req.readyState === 4) {
						if (req.status === 200 || req.status === 201) {
							success(req.responseText);
						}
					}
				}
			}
		}

	}

	appCMD.utility = {
		init: function() {
			this.hideAllSections();
		},

		// hideAllSections loops through every 'section' class and removes class 'active'.
		hideAllSections: function () {
			_.each(document.getElementsByClassName("section"), function(el) {
	            el.classList.remove('active'); 
	        });
		}

	}

})();

var image = document.createElement('img');
image.setAttribute('src', 'static/images/ajax-loader.gif');
image.classList.add('loader');
document.getElementsByTagName('body')[0].appendChild(image);

setTimeout(
	function(){
		image.parentNode.removeChild(image);
		appCMD.controller.init();
	}, 1800);




