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
let target_stocks_amount: number = 5;

function update() {
    /* Update timer */
    let delta_time = 0.016;

    /* Update stocks */
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] === undefined) {
            continue;
        }
        stocks[i].update(delta_time);
        if (stocks[i].get_price() <= 0) {
            Materialize.toast(stocks[i].get_name() + " is now bankrupt!", 5000, "red");
            stocks[i].remove();
            stocks.splice(i, 1);
        }
    }

    /* New stocks if there aren't enough of them! */
    if ((target_stocks_amount - stocks.length) * Math.random() > 0.9) {
        create_stock();
    }

    /* Update stats */
    $("#networth").html("" + get_worth().toFixed(0));
    $("#money").html("" + money.toFixed(0));
    $("#loans").html("" + loans.toFixed(0));
    $("#stockworth").html("" + get_stock_worth().toFixed(0));
    $("#rep").html(get_reputation_message());

    /* Keep the loop going, browser! */
    requestAnimationFrame(update);
}

/* Reputation */
function get_reputation_message(): string {
    if (reputation <= -50) {
        return "Practically Satan";
    }
    if (reputation < 0 && reputation > -50) {
        return "Bad";
    }
    if (reputation > 0 && reputation < 50) {
        return "Good";
    }
    if (reputation >= 50) {
        return "Practically Jesus";
    }
    return "Unknown";
}
/* /Reputation */

/* Money utilities */
function get_worth(): number {
    return money - loans + get_stock_worth();
}

function get_stock_worth(): number {
    let worth = 0;
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] === undefined) {
            continue;
        }
        worth += stocks[i].get_price() * stocks[i].get_bought_amount();
    }
    return worth;
}

function pay_loans(): void {
    let amount = (loans >= money) ? money : loans;
    money -= amount;
    loans -= amount;
}
/* /Money utilities */

/* Stock utilities */
function create_stock(): Stock {
    let stock = new Stock();
    stocks.push(stock);
    return stock;
}

function get_stock(stock_id: number): Stock {
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined && stocks[i].id === stock_id) {
            return stocks[i];
        }
    }
    return null;
}

function buy_stock(stock_id: number): void {
    let stock = get_stock(stock_id);
    if (stock !== undefined && stock.get_can_buy()) {
        if (money < stock.get_price()) {
            loans += stock.get_price() - money;
            money = 0;
        } else {
            money -= stock.get_price();
        }
        stock.set_bought_amount(stock.get_bought_amount() + 1);
        stock.set_can_sell(true);
        if (stock.get_bought_amount() >= stock.get_total_amount()) {
            stock.set_can_buy(false);
        }
        Materialize.toast("<span class='flow-text'>Bought <b>" + get_stock(stock_id).get_shortened_name() + "</b> stock!</span>", 1000, "cyan");
    }
}

function sell_stock(stock_id: number): void {
    let stock = get_stock(stock_id);
    if (stock !== undefined && stock.get_can_sell()) {
        money += stock.get_price();
        stock.set_bought_amount(stock.get_bought_amount() - 1);
        stock.set_can_buy(true);
        if (stock.get_bought_amount() <= 0) {
            stock.set_can_sell(false);
        }
        Materialize.toast("<span class='flow-text'>Sold <b>" + get_stock(stock_id).get_shortened_name() + "</b> stock!</span>", 1000, "orange");
    }
}
/* /Stock utilities */

/* Start the game */
create_stock();
update();
