/*
 * "Make More Money!" - A management game about making money in the stock exchange.
 * Written in 2016 by Jeasonfire <contact@jeasonfi.re>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

let money: number = 0;
let loans: number = 0;
let reputation: number = 0;
let stocks: Stock[] = [];


let update = () => {
    // Make the stats go up arbitrarily for now
    money += 1 * Math.max(1, Math.sqrt(money));
    reputation += 0.25;

    // Update stats
    $("#money").html("" + money.toFixed(0));
    $("#rep").html("" + reputation.toFixed(0));

    // Keep the loop going, browser!
    requestAnimationFrame(update);
};

/* Stock utilities */
let create_stock = () => {
    let stock = new Stock();
    stocks[stock.id] = stock;
};

let get_stock = (stock_id: number) => {
    return stocks[stock_id];
};

let buy_stock = (stock_id: number) => {
    let stock = get_stock(stock_id);
    if (stock !== undefined && stock.get_can_buy()) {
        Materialize.toast("<span class='flow-text'>Bought <b>" + get_stock(stock_id).get_shortened_name() + "</b> stock!</span>", 1000, "rounded cyan");
    }
};

let sell_stock = (stock_id: number) => {
    let stock = get_stock(stock_id);
    if (stock !== undefined && stock.get_can_sell()) {
        Materialize.toast("<span class='flow-text'>Sold <b>" + get_stock(stock_id).get_shortened_name() + "</b> stock!</span>", 1000, "rounded orange");
    }
};
/* /Stock utilities */

/* Start the game */
create_stock();
update();
