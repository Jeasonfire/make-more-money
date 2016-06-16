/*
 * "Make More Money!" - A management game about making money in the stock exchange.
 * Written in 2016 by Jeasonfire <contact@jeasonfi.re>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

class Stock {
    private static used_ids: number = 0;

    /* An unique identifier for this stock (to differentiate stocks in the html) */
    public id: number;

    /* Stats and info about the stock */
    private name: string = "";
    private price: number = 0;
    private total_amount: number = 0;
    private bought_amount: number = 0;
    private can_sell: boolean = false;
    private can_buy: boolean = false;
    private attributes: string[] = [];

    /* Things that affect how the stock will do in the future */
    private price_change_range = 0;
    private price_change_per_second: number = 0;
    private price_change_volatility: number = 0;
    private price_change_time: number = 0;

    public constructor() {
        this.id = Stock.used_ids++;
        let html = stock_template_html.replace(/stock-id/g, "" + this.id);
        $("#stocks").html($("#stocks").html() + html);

        this.price_change_range = this.new_price_change_range();
        this.price_change_per_second = this.new_price_change_per_second();
        this.price_change_volatility = this.new_price_change_volatility();
        this.price_change_time = this.new_price_change_time();

        this.set_name(Util.generate_name());
        this.set_price(1000);
        this.set_total_amount(Math.floor(Math.max(5, Math.random() * Math.pow(10, 1 + Math.round(Math.random() * 2)))));
        this.set_can_buy(true);
        this.set_can_sell(false);

        /* Random starting attributes */
        if (Math.random() < 0.3) {
            if (Math.random() < 0.5) {
                this.add_attribute("reputation-up");
            } else {
                this.add_attribute("reputation-down");
            }
        }
    }

    private new_price_change_range(): number {
        return 250 * (Math.random() * 0.5 + 0.75);
    }

    private new_price_change_per_second(): number {
        let change = (Math.random() * 2 - 1);
        if (change < -0.8 && this.has_attribute("reputation-up") && Math.random() < 0.9) {
            change *= 3;
        }
        if (change < 0 && this.has_attribute("reputation-down") && this.has_attribute("price-up")) {
            change += 0.2;
        }
        return this.price_change_range * change;
    }

    private new_price_change_volatility(): number {
        return 0.5 + Math.random();
    }

    private new_price_change_time(): number {
        return Date.now() + this.price_change_volatility * 10000;
    }

    public update(delta_time: number) {
        /* Update prices */
        this.set_price(this.price + this.price_change_per_second * delta_time);
        if (this.price_change_time < Date.now()) {
            this.price_change_per_second = this.new_price_change_per_second();
            if (Math.random() < 0.3) {
                this.price_change_volatility = this.new_price_change_volatility();
            }
            this.price_change_time = this.new_price_change_time();
        }

        /* Update attibutes */
        /* Price changing attribs */
        if (Math.abs(this.price_change_per_second) < this.price_change_range / 10) {
            this.remove_attribute("price-up");
            this.remove_attribute("price-down");
            this.add_attribute("price-stable");
        } else {
            if (this.price_change_per_second < 0) {
                this.remove_attribute("price-up");
                this.remove_attribute("price-stable");
                this.add_attribute("price-down");
            } else {
                this.remove_attribute("price-down");
                this.remove_attribute("price-stable");
                this.add_attribute("price-up");
            }
        }
        /* /Price changing attribs */
        /* Reputation changing  attributes */
        if (Math.random() < 0.1 * delta_time) {
            if (!this.has_attribute("reputation-up") && !this.has_attribute("reputation-down")) {
                if (Math.random() < 0.5) {
                    this.add_attribute("reputation-up");
                } else {
                    this.add_attribute("reputation-down");
                }
            } else {
                if (this.has_attribute("reputation-up") && Math.random() < 0.8) {
                    this.remove_attribute("reputation-up");
                }
                if (this.has_attribute("reputation-down") && Math.random() < 0.7) {
                    this.remove_attribute("reputation-down");
                }
            }
        }
        /* /Reputation changing  attributes */
    }

    public remove() {
        $("#" + this.id + "-stock").remove();
    }

    public get_shortened_name(): string {
        return this.name.substring(0, Math.min(3, this.name.length)).toUpperCase();
    }

    public get_name(): string { return this.name; }
    public get_price(): number { return this.price; }
    public get_total_amount(): number { return this.total_amount; }
    public get_bought_amount(): number { return this.bought_amount; }
    public get_can_buy(): boolean { return this.can_buy; }
    public get_can_sell(): boolean { return this.can_sell; }
    public get_attributes(): string[] { return this.attributes; }
    public has_attribute(attribute: string) { return this.attributes.indexOf(attribute) !== -1; }

    public set_name(name: string) {
        this.name = name;
        $("#" + this.id + "-name").html(this.name + " [" + this.get_shortened_name() + "]");
    }

    public set_price(price: number) {
        this.price = price;
        $("#" + this.id + "-price").html(Util.get_money_formatted(this.price));
        this.set_total_amount(this.total_amount);
    }

    public set_total_amount(total_amount: number) {
        this.total_amount = total_amount;
        $("#" + this.id + "-total-value").html(Util.get_money_formatted(this.price * this.total_amount));
        this.set_bought_amount(this.bought_amount);
    }

    public set_bought_amount(bought_amount: number) {
        this.bought_amount = bought_amount;
        $("#" + this.id + "-owned-percent").html("" + (100 * this.bought_amount / this.total_amount).toFixed(1));
    }

    public set_can_buy(can_buy: boolean) {
        this.can_buy = can_buy;
        if (this.can_buy && $("#" + this.id + "-buy").hasClass("disabled")) {
            $("#" + this.id + "-buy").removeClass("disabled");
        } else if (!this.can_buy && !$("#" + this.id + "-buy").hasClass("disabled")) {
            $("#" + this.id + "-buy").addClass("disabled");
        }
    }

    public set_can_sell(can_sell: boolean) {
        this.can_sell = can_sell;
        if (this.can_sell && $("#" + this.id + "-sell").hasClass("disabled")) {
            $("#" + this.id + "-sell").removeClass("disabled");
        } else if (!this.can_sell && !$("#" + this.id + "-sell").hasClass("disabled")) {
            $("#" + this.id + "-sell").addClass("disabled");
        }
    }

    public set_can_buy_and_sell_auto() {
        this.set_can_buy(this.get_total_amount() > this.get_bought_amount());
        this.set_can_sell(this.get_bought_amount() > 0);
    }

    public add_attribute(attribute: string) {
        if (this.attributes.indexOf(attribute) === -1) {
            this.attributes.push(attribute);
            $("#" + this.id + "-attributes").html($("#" + this.id + "-attributes").html() + "<i id='" + this.id + "-attribute-" + attribute + "' class='material-icons right chip small " + StockAttribute[attribute][1] + "'>" + StockAttribute[attribute][0] + "</i>");
        }
    }

    public remove_attribute(attribute: string) {
        let index = this.attributes.indexOf(attribute);
        if (index !== -1) {
            this.attributes.splice(index, 1);
            $("#" + this.id + "-attribute-" + attribute).remove();
        }
    }

    public clear_attributes() {
        for (let i = 0; i < this.attributes.length; i++) {
            this.remove_attribute(this.attributes[i]);
        }
    }
}

let StockAttribute = {
    "reputation-up": ["thumb_up", "green", "This company is doing something charitable!"],
    "reputation-down": ["thumb_down", "red", "This company is doing something unethical!"],
    "price-up": ["trending_up", "cyan", "This stock is going up!"],
    "price-stable": ["trending_flat", "", "This stock is stagnating."],
    "price-down": ["trending_down", "orange", "This stock is going down!"],
};

let stock_template_html = `
<div id="stock-id-stock" class="col s12">
    <div class="divider"></div>

    <!-- Name -->
    <div class="col s4">
        <h5 id="stock-id-name" class="flow-text">The Boop Corporation</h5>
    </div>
    <!-- /Name -->

    <!-- Price -->
    <div class="col s8">
        <h5 class="flow-text right">Owned: <b><span id="stock-id-owned-percent"></span>%</b> - Value: <b><span id="stock-id-total-value"></span></b> (<span id="stock-id-price"></span> / stock)</h5>
    </div>
    <!-- /Price -->

    <!-- Buttons & attributes -->
    <div class="col s12">
        <!-- Buying and selling -->
        <div class="col s12 m4">
            <div>
                <a id="stock-id-sell" class="btn-floating btn-medium orange" onclick="sell_stock(get_stock(stock-id))">
                    <i class="material-icons">remove</i>
                </a>
                <a id="stock-id-buy" class="btn-floating btn-medium cyan" onclick="buy_stock(get_stock(stock-id))">
                    <i class="material-icons">add</i>
                </a>
            </div>
        </div>
        <!-- /Buying and selling -->

        <!-- Stock attributes -->
        <div class="col s12 m8">
            <div id="stock-id-attributes">
            </div>
        </div>
        <!-- /Stock attributes -->
    </div>
    <!-- /Buttons & attributes -->
    <div class="col s12"><p></p></div>
</div>
`;
