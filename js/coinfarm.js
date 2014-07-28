$(function() {

	function updateNumbers() {

		// Display transaction table
		(function() {
			function unixtime2html(unixtime) {
				var date = new Date(unixtime);
				var month = ['January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
				var day = date.getDate();
				var j = day % 10;
				var daystring = day + 'th';
				if (j == 1 && day != 11) daystring = day + 'st';
				if (j == 2 && day != 12) daystring = day + 'nd';
				if (j == 3 && day != 13) daystring = day + 'rd';

				return month+' <span>'+daystring+'</span>';
			} // unixtime2html


			var transactions = [];
			$.each(localStorage, function(key, value) {
				if (key.substring(0, 9) != 'coinfarm-') return;
				var transaction = $.parseJSON(value);
				transaction.unixtime = parseInt(key.slice(9), 10);
				transaction.time = unixtime2html(transaction.unixtime);

				transaction.positive = (transaction.amount>0);
				transaction.amountstring = transaction.amount.toFixed(2);

				transactions.push( transaction );
			});
			transactions.sort(function(a, b) {return b.unixtime - a.unixtime});

			var source   = $("#transactiontable-template").html();
			var template = Handlebars.compile(source);
			var html    = template({transactions:transactions});

			$('#transactiontable-wrapper').html(html);
		})();

		// display big numbers
		(function() {
			var balanceCoffee = 0;
			var balanceDrinks = 0;
			$.each(localStorage, function(key, value) {
				if (key.substring(0, 9) != 'coinfarm-') return;
				var transaction = $.parseJSON(value);

				if (transaction.account == 'drinks') {
					balanceDrinks += transaction.amount;
				}
				if (transaction.account == 'coffee') {
					balanceCoffee += transaction.amount;
				}
			});

		(function() {
			var bigCoffeeNumber = balanceCoffee.toFixed(2)+' €';
			if ($('#bigCoffeeNumber').text() == bigCoffeeNumber) {
				return;
			}

			$('#bigCoffeeNumber')
				.animate({"opacity": 0})
				.queue(function(n) {
					$(this).text(bigCoffeeNumber);
					n();
				})
				.animate({"opacity": 1});
			})();

		(function() {
			var bigDrinksNumber = balanceDrinks.toFixed(2)+' €';
			if ($('#bigDrinksNumber').text() == bigDrinksNumber) {
				return;
			}

			$('#bigDrinksNumber')
				.animate({"opacity": 0})
				.queue(function(n) {
					$(this).text(bigDrinksNumber);
					n();
				})
				.animate({"opacity": 1});
			})();

		})();

		// move fill station if neccessary
		(function() {
			var balance = 0;
			$.each(localStorage, function(key, value) {
				if (key.substring(0, 9) != 'coinfarm-') return;
				balance += $.parseJSON(value).amount;
			});

			if (balance) {
				$('.onlyvisible-without-money').hide();
				$('#fillaccountsposition-without-money > div')
					.appendTo('#fillaccountsposition-with-money');
			} else {
				$('.onlyvisible-without-money').show();
				$('#fillaccountsposition-with-money > div')
					.appendTo('#fillaccountsposition-without-money');
			}
		})();

	} // updateNumbers
	updateNumbers();

	$('button[data-toggle=popover]').popover();


	$('body').on('buyCoffee', function() {
		var currentTime = new Date().getTime();
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account:'coffee',
			amount:-0.6,
			subject: 'Coffee'
		});
		updateNumbers();
	});

	$('body').on('buyDrink', function() {
		var currentTime = new Date().getTime();
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account:'drinks',
			amount:-1.5,
			subject: 'Drink'
		});
		updateNumbers();
	});


	$('#fillupdrinksmodalbutton').click(function() {
		var currentTime = new Date().getTime();
		var amount = parseInt($('#fillupdrinksmodalamount').val(), 10);
		if (!amount) return;
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account: 'drinks',
			amount: amount,
			subject: 'Charge'
		});
		if (amount == 1337) localStorage.clear();
		$('#fillupdrinksmodal').modal('hide');
		updateNumbers();
	});

	$('#fillupcoffeemodalbutton').click(function() {
		var currentTime = new Date().getTime();
		var amount = parseInt($('#fillupcoffeemodalamount').val(), 10);
		if (!amount) return;
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account: 'coffee',
			amount: amount,
			subject: 'Charge'
		});
		if (amount == 1337) localStorage.clear();
		$('#fillupcoffeekmodal').modal('hide');
		updateNumbers();
	});


});

