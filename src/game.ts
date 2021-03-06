/*
 * "Make More Money!" - A management game about making money in the stock exchange.
 * Written in 2016 by Jeasonfire <contact@jeasonfi.re>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

 /*
 * TODO:
 * - Options menu + Main menu + Intro?
 * - Penalty for being invested in a company that goes bankrupt
 * - Trusted-stat (and more trust/reputation titles)
 * - Buying/selling affecting the price of things (at least by trust)
 */

let REP_TABLE: string[] = ["Martin Shkreli", "Incarnation of Evil",
        "Practically Satan", "Literally Hitler", "Evil", "Hated", "Very Bad",
        "Bad", "Disliked", "Unpleasant", "Neutral", "Nice", "Liked", "Good",
        "Very Good", "Loved", "Saint", "Figuratively Gandhi",
        "Practically Jesus", "Incarnation of Good", "Bernie Sanders"];
let TRUST_TABLE: string[] = ["Very unreliable", "Unreliable", "Neutral",
        "Reliable", "Very reliable"];

let game_running = false;

let money: number = 0;
let loans: number = 0;
let reputation: number = 0;
let trusted: number = 0;
let stocks: Stock[] = [];

let target_stocks_amount: number = 0;
let target_stocks_amount_max: number = 5;
let target_stocks_amount_change_time: number = 0;

let investment_amount: number = $("#investment-amount").val();
let interest_rate: number = 0.01;

let last_time = Date.now();
function game_update() {
    /* Update timer */
    let now_time = Date.now();
    let delta_time = (now_time - last_time) / 1000.0;
    last_time = now_time;

    /* Update stocks */
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined) {
            stocks[i].update(delta_time);
            if (stocks[i].get_price() <= 0) {
                stocks[i].remove();
                stocks.splice(i, 1);
            }
        }
    }

    /* Update loan interest */
    loans += loans * interest_rate * delta_time;

    /* Update trust */
    if (get_worth() < 0) {
        trusted -= 0.1 * delta_time;
    } else if (get_worth() > 0) {
        trusted += 0.05 * delta_time;
    } else {
        trusted += 0.025 * delta_time * (trusted < 0 ? 1 : (trusted > 0 ? -1 : 0));
    }

    /* Update background */
    let scaledRep = (get_reputation_scaled() / 10);
    if (reputation < 0) {
        $("body").css("background-color", "rgb(255, " + Math.round(255 - 50 * scaledRep) + ", " + Math.round(255 - 50 * scaledRep) + ")");
    }
    if (reputation > 0) {
        $("body").css("background-color", "rgb(" + Math.round(255 - 50 * scaledRep) + ", 255, 255)");
    }

    /* Update bailout button */
    if (can_bailout() && $("#bailout").hasClass("disabled")) {
        $("#bailout").removeClass("disabled");
    }
    if (!can_bailout() && !$("#bailout").hasClass("disabled")) {
        $("#bailout").addClass("disabled");
    }

    /* New stocks if there aren't enough of them! */
    if (target_stocks_amount < target_stocks_amount_max && target_stocks_amount_change_time < Date.now()) {
        target_stocks_amount_change_time = Date.now() + 1000 * (10 + Math.pow(3, target_stocks_amount));
        target_stocks_amount++;
    }
    if ((target_stocks_amount - stocks.length) * Math.random() > 0.9) {
        create_stock();
    }

    /* Update stats */
    $("#networth").html(Util.get_money_formatted(get_worth()));
    $("#money").html(Util.get_money_formatted(money));
    $("#loans").html(Util.get_money_formatted(loans));
    $("#stockworth").html(Util.get_money_formatted(get_stock_worth()));

    $("#rep").html(get_reputation_message());
    $("#trust").html(get_trusted_message());
    $("#maxloan").html(Util.get_money_formatted(get_max_loans()));

    if (game_running) {
        requestAnimationFrame(game_update);
    }
}

/* Reputation */
function get_reputation_message(): string {
    let rep = Math.round(get_reputation_scaled());
    if (reputation < 0) {
        rep = 10 - rep;
    } else {
        rep += 10;
    }
    return REP_TABLE[rep];
}

function get_trusted_message(): string {
    let trust = Math.round(get_trusted_scaled());
    if (trusted < 0) {
        trust = 2 - trust;
    } else {
        trust += 2;
    }
    return TRUST_TABLE[trust];
}

function get_reputation_scaled(): number {
    return Math.min(10, Math.pow(Math.abs(reputation), 0.8));
}

function get_trusted_scaled(): number {
    return Math.min(2, Math.pow(Math.abs(trusted), 0.25));
}
/* /Reputation */

/* Money utilities */
function get_worth(): number {
    return money - loans + get_stock_worth();
}

function get_stock_worth(): number {
    let worth = 0;
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined) {
            worth += stocks[i].get_price() * stocks[i].get_bought_amount();
        }
    }
    return worth;
}

function get_market_worth(): number {
    let worth = 0;
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined) {
            worth += stocks[i].get_price() * stocks[i].get_total_amount();
        }
    }
    return worth;
}

function get_max_loans(): number {
    let scaled_trusted = get_trusted_scaled();
    if (trusted < 0) {
        scaled_trusted = 2 - scaled_trusted;
    } else {
        scaled_trusted += 2;
    }
    return Math.max(0, (get_worth() + 10000) * (scaled_trusted / 4 * 1.5 + 0.25));
}

function pay_loans() {
    let amount = (loans >= money) ? money : loans;
    money -= amount;
    loans -= amount;
}

let old_invest_amount = 0;
function save_old_invest_amount() {
    old_invest_amount = $("#investment-amount").val();
}
function load_old_invest_amount() {
    $("#investment-amount").val(old_invest_amount);
}

function update_investment_amount() {
    let value_str = $("#investment-amount").val();
    let value = Math.min(Math.pow(10, 15), Math.max(0, parseInt(value_str.replace(/ /g, ""))));
    console.log("Value: " + value + ", value_str: " + value_str);
    if (value !== undefined && !isNaN(value)) {
        $("#investment-amount-button").html("$" + value);
        investment_amount = value;
    } else {
        load_old_invest_amount();
        Materialize.toast("Type numbers in there!", 5000);
    }
}

function can_bailout() {
    return get_stock_worth() === 0 && money === 0 && loans > 0;
}

function bailout() {
    if (can_bailout()) {
        this.reputation -= Math.sqrt(loans) / 50;
        this.loans = 0;
    }
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

function buy_stock(stock: Stock, amount: number = -1) {
    if (amount === -1) {
        amount = Math.floor(investment_amount / stock.get_price());
        if (amount === 0) {
            Materialize.toast("Your max investment is too low!", 5000, "red");
        }
    }
    let max_buyable = Math.max(0, Math.floor((money + get_max_loans() - loans) / stock.get_price()));
    let available = stock.get_total_amount() - stock.get_bought_amount();
    amount = Util.clamp(amount, 0, Math.min(max_buyable, available));
    let total_price = amount * stock.get_price();

    /* Take money */
    if (money < total_price) {
        loans += total_price - money;
        money = 0;
    } else {
        money -= total_price;
    }
    /* /Take money */

    /* Update reputation */
    if (stock.has_attribute("reputation-up")) {
        reputation += (amount / stock.get_total_amount());
    }
    if (stock.has_attribute("reputation-down")) {
        reputation -= (amount / stock.get_total_amount());
    }
    /* /Update reputation */

    /* Update stock infos */
    stock.set_bought_amount(stock.get_bought_amount() + amount);
    stock.set_can_buy_and_sell_auto();
    /* /Update stock infos */
}

function sell_stock(stock: Stock, amount: number = Math.ceil(investment_amount / stock.get_price())) {
    amount = Util.clamp(amount, 0, stock.get_bought_amount());

    money += stock.get_price() * amount;
    stock.set_bought_amount(stock.get_bought_amount() - amount);
    stock.set_can_buy_and_sell_auto();
}

function sell_all_stocks() {
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined) {
            sell_stock(stocks[i], stocks[i].get_bought_amount());
        }
    }
}
/* /Stock utilities */

/* Options */
let in_options = false;
function options_open() {
    pause_game();
    in_options = true;
}
function options_close() {
    Util.prefix_type = parseInt($("#number-format").val());
    Util.currency = $("#currency-symbol").val();
    switch ($("#difficulty").val()) {
        case "0": Stock.price_change_modifier = 1.0; break;
        case "1": Stock.price_change_modifier = 0.25; break;
        case "2": Stock.price_change_modifier = 0.0; break;
        case "3": Stock.price_change_modifier = -0.25; break;
        case "4": Stock.price_change_modifier = -1.0; break;
    }
    resume_game();
    in_options = false;
}
/* /Options */

/* Tutorial */
let in_tutorial = false;
function tutorial_open() {
    pause_game();
    in_tutorial = true;
}
function tutorial_close() {
    resume_game();
    in_tutorial = false;
}
/* /Tutorial */

/* Start the game */
$(document).ready(() => {
    $(".modal-trigger").leanModal({
        complete: () => {
            if (in_options) {
                options_close();
            }
            console.log("asd");
            if (in_tutorial) {
                console.log("Closing from tutorial");
                tutorial_close();
                console.log("After closing, game is running: " + game_running);
            }
        }
    });
    $("select").material_select();
});

function close_mainmenu() {
    $("#mainmenu").addClass("hide");
}

function start_game() {
    create_stock();
    resume_game();
    $("#game").removeClass("hide");
}

function resume_game() {
    game_running = true;
    last_time = Date.now();
    game_update();
}

function pause_game() {
    game_running = false;
}

function stop_game() {
    game_running = false;
    $("#game").addClass("hide");
}
