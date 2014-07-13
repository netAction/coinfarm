$(function() {
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

	function displayTransactionTable() {
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

	} // displayTransactionTable
	displayTransactionTable();


	function displayBigNumber() {
		var balance = 0;
		$.each(localStorage, function(key, value) {
			if (key.substring(0, 9) != 'coinfarm-') return;
			balance += $.parseJSON(value).amount;
		});

		$('.bignumber')
			.animate({"opacity": 0})
			.queue(function(n) {
				$(this).text(balance.toFixed(2)+'€');
				n();
			})
			.animate({"opacity": 1});

	} // displayBigNumber
	displayBigNumber();

	$('#buydrinkbutton').click(function() {
		var currentTime = new Date().getTime();
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account:'drinks',
			amount:-1.5,
			subject: 'Drink'
		});
		$('#buydrinkmodal').modal('hide');
		displayTransactionTable();
		displayBigNumber();
	});

	$('#fillupdrinkmodalbutton').click(function() {
		var currentTime = new Date().getTime();
		var amount = parseInt($('#fillupdrinkmodalamount').val(), 10);
		if (!amount) return;
		localStorage['coinfarm-'+currentTime.toString()] = JSON.stringify({
			account: 'drinks',
			amount: amount,
			subject: 'Charge'
		});
		if (amount == 1337) localStorage.clear();
		$('#fillupdrinkmodal').modal('hide');
		displayTransactionTable();
		displayBigNumber();
	});

});

