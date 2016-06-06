class Stock {
    private static used_ids: number = 0;

    /* An unique identifier for this stock (to differentiate stocks in the html) */
    public id: number;

    /* Stats and info about the stock */
    public name: string;
    public price: number;
    public can_buy: boolean;
    public can_sell: boolean;

    public constructor() {
        this.name = "Temp Corporation";
        this.price = 100;
        this.can_buy = true;
        this.can_sell = true;

        this.id = Stock.used_ids++;
        let html = stock_template_html.replace(/stock-id/g, "" + this.id);
        $("#stocks").html($("#stocks").html() + html);
    }

    /* Make everything private & move everything in here to the setters */
    public update() {
        $("#" + this.id + "-name").html(this.name + " [" + this.get_shortened_name() + "]");
        $("#" + this.id + "-price").html("" + this.price);

        if (this.can_buy && $("#" + this.id + "-buy").hasClass("disabled")) {
            $("#" + this.id + "-buy").removeClass("disabled");
        } else if (!this.can_buy && !$("#" + this.id + "-buy").hasClass("disabled")) {
            $("#" + this.id + "-buy").addClass("disabled");
        }

        if (this.can_sell && $("#" + this.id + "-sell").hasClass("disabled")) {
            $("#" + this.id + "-sell").removeClass("disabled");
        } else if (!this.can_sell && !$("#" + this.id + "-sell").hasClass("disabled")) {
            $("#" + this.id + "-sell").addClass("disabled");
        }
    }

    public get_shortened_name(): string {
        let result = "";
        let name_parts = this.name.split(" ");
        for (let i = 0; i < name_parts.length; i++) {
            result += name_parts[i].substring(0, Math.min(2, name_parts[i].length)).toUpperCase();
        }
        return result;
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
