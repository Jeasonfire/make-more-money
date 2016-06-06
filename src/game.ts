let money = 2;
let boop = () => {
    money += 1;
    $("#money").html("" + money.toFixed(0));
    $("#rep").html("" + (money / 100).toFixed(0));
    requestAnimationFrame(boop);
};

boop();
