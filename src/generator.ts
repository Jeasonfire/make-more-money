/*
 * "Make More Money!" - A management game about making money in the stock exchange.
 * Written in 2016 by Jeasonfire <contact@jeasonfi.re>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

class Generator {
    private static names: string[] = [
        "Apple", "Orange", "Cherry", "Cranberry", "Grape", "Pear",
        "Pomegranate", "Raspberry", "Strawberry", "Melon", "Pepper",
        "Cabbage", "Radish", "Onion", "Potato", "Tomato", "Apricot",
        "Cantaloupe", "Mango", "Nectarine", "Peach", "Carrot", "Pumpkin",
        "Lemon", "Kiwi", "Turnip", "Corn", "Avocado", "Broccoli", "Bean",
        "Celery", "Banana", "Garlic", "Mushroom", "Leek"
    ];
    private static nametypes: string[] = ["Co.", "Corp.", "Inc.", "Ltd."];

    public static generate_name(): string {
        return Generator.names[Math.floor(Generator.names.length * Math.random())] + " " +
                Generator.nametypes[Math.floor(Generator.nametypes.length * Math.random())];
    }
}
