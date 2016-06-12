/*
 * "Make More Money!" - A management game about making money in the stock exchange.
 * Written in 2016 by Jeasonfire <contact@jeasonfi.re>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

class Util {
    public static PREFIXES_METRIC: number = 0;
    public static PREFIXES_LONG_SCALE: number = 1;
    public static PREFIXES_LONG_SCALE_THOUSANDS: number = 2;
    public static PREFIXES_SHORT_SCALE: number = 3;

    private static names: string[] = [
        "Apple", "Orange", "Cherry", "Cranberry", "Grape", "Pear",
        "Pomegranate", "Raspberry", "Strawberry", "Melon", "Pepper",
        "Cabbage", "Radish", "Onion", "Potato", "Tomato", "Apricot",
        "Cantaloupe", "Mango", "Nectarine", "Peach", "Carrot", "Pumpkin",
        "Lemon", "Kiwi", "Turnip", "Corn", "Avocado", "Broccoli", "Bean",
        "Celery", "Banana", "Garlic", "Mushroom", "Leek"
    ];
    private static nametypes: string[] = ["Co.", "Corp.", "Inc.", "Ltd."];
    private static prefixes: string[][] = [
        ["k", "M", "G", "T", "P", "E", "Z", "Y"],
        [
            " thousand", " million", " milliard", " billion", " billiard",
            " trillion", " trilliard", " quadrillion", " quadrilliard",
            " quintillion", " quintilliard", " sextillion", " sextilliard",
            " septillion", " septilliard"
        ],
        [
            " thousand", " million", " thousand million", " billion",
            " thousand billion", " trillion", " thousand trillion",
            " quadrillion", " thousand quadrillion", " quintillion",
            " thousand quintillion", " sextillion", " thousand sextillion",
            " septillion", " thousand septillion"
        ],
        [
            " thousand", " million", " billion", " trillion", " quadrillion",
            " quintillion", " sextillion", " septillion"
        ]
    ];

    public static prefix_type: number = Util.PREFIXES_METRIC;

    public static generate_name(): string {
        return Util.names[Math.floor(Util.names.length * Math.random())] + " " +
                Util.nametypes[Math.floor(Util.nametypes.length * Math.random())];
    }

    public static get_money_formatted(amount: number): string {
        let digits = amount.toFixed(0).length;
        let loan = amount < 0 ? "red-text" : "";
        let power = Math.min(Math.floor(digits / 3), Util.prefixes.length);
        return "<span class='" + loan + "'>" + Util.get_money_formatted_without_shortening((amount / Math.pow(1000, power))) + (power > 0 ? Util.prefixes[Util.prefix_type][power - 1] : "") + "</span>";
    }

    public static get_money_formatted_without_shortening(amount: number): string {
        let result = amount.toFixed(1);
        if (result.substring(0, 1) === "-") {
            result = "-$" + result.substring(1);
        } else {
            result = "$" + result;
        }
        return result;
    }
}
