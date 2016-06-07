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
    private name: string;
    private price: number;
    private can_sell: boolean;
    private can_buy: boolean;

    public constructor() {
        this.name = "Temp Corporation";
        this.price = 100;
        this.can_buy = true;
        this.can_sell = true;

        this.id = Stock.used_ids++;
        let html = stock_template_html.replace(/stock-id/g, "" + this.id);
        $("#stocks").html($("#stocks").html() + html);
    }

    public get_shortened_name(): string {
        let result = "";
        let name_parts = this.name.split(" ");
        for (let i = 0; i < name_parts.length; i++) {
            result += name_parts[i].substring(0, Math.min(2, name_parts[i].length)).toUpperCase();
        }
        return result;
    }

    public get_name(): string { return this.name; }
    public get_price(): number { return this.price; }
    public get_can_buy(): boolean { return this.can_buy; }
    public get_can_sell(): boolean { return this.can_sell; }

    public set_name(name: string) {
        this.name = name;
        $("#" + this.id + "-name").html(this.name + " [" + this.get_shortened_name() + "]");
    }

    public set_price(price: number) {
        this.price = price;
        $("#" + this.id + "-price").html("" + this.price);
    }

    public add_price(delta_price: number) {
        this.set_price(this.price + delta_price);
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
}

let stock_template_html = `
<div id="stock-id-stock" class="col s12">
    <!-- Name -->
    <div class="col s6">
        <h5 id="stock-id-name" class="flow-text">The Boop Corporation</h5>
    </div>
    <!-- /Name -->

    <!-- Price -->
    <div class="col s6">
        <h4 class="flow-text right">$<span id="stock-id-price">100</span></h4>
    </div>
    <!-- /Price -->

    <!-- Buttons & attributes -->
    <div class="col s12">
        <!-- Buying and selling -->
        <div class="col s12 m4">
            <div>
                <a id="stock-id-sell" class="btn-floating btn-medium waves-effect waves-light orange tooltipped" data-position="top" data-delay="10" data-tooltip="Sell" onclick="sell_stock(stock-id)">
                    <i class="material-icons">remove</i>
                </a>
                <a id="stock-id-buy" class="btn-floating btn-medium waves-effect waves-light cyan tooltipped" data-position="top" data-delay="10" data-tooltip="Buy" onclick="buy_stock(stock-id)">
                    <i class="material-icons">add</i>
                </a>
            </div>
        </div>
        <!-- /Buying and selling -->

        <!-- Stock attributes -->
        <div class="col s12 m8">
            <div id="stock-id-attributes">
                <i class="material-icons right cyan chip small tooltipped" data-position="top" data-delay="10" data-tooltip="This stock is going up. Hop on the bandwagon!">trending_up</i>
                <i class="material-icons right green chip small tooltipped" data-position="top" data-delay="10" data-tooltip="This stock is hot in the media. Time to get that reputation up!">favorite</i>
            </div>
        </div>
        <!-- /Stock attributes -->
    </div>
    <!-- /Buttons & attributes -->
</div>
`;
