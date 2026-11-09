/* Open/closed status, pure so it can be tested in Node (test/status.test.js).
   HOURS: day index (0 = Sunday) -> [open, close] in minutes since midnight, Europe/Rome. */
var SHOP_HOURS = { 0: null, 1: null, 2: [480, 1200], 3: [480, 1200], 4: [480, 1200], 5: [480, 1200], 6: [480, 1200] };
var SHOP_DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

function shopClock(m) {
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

/* -> { open: boolean, text: string } */
function shopStatus(day, min, hours) {
  hours = hours || SHOP_HOURS;
  var today = hours[day];
  if (today && min >= today[0] && min < today[1]) {
    return { open: true, text: 'Aperto ora, fino alle ' + shopClock(today[1]) };
  }
  if (today && min < today[0]) {
    return { open: false, text: 'Chiuso ora, apre alle ' + shopClock(today[0]) };
  }
  for (var i = 1; i <= 7; i++) {
    var d = (day + i) % 7;
    if (hours[d]) {
      return { open: false, text: 'Chiuso ora, riapre ' + (i === 1 ? 'domani' : SHOP_DAYS[d]) + ' alle ' + shopClock(hours[d][0]) };
    }
  }
  return { open: false, text: 'Chiuso ora' };
}

if (typeof module !== 'undefined') module.exports = { shopStatus: shopStatus, SHOP_HOURS: SHOP_HOURS };
