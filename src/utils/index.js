exports.processContent = function (content) {
    //msgarr[1]为活动名
    let msgarr = content.split(' ');
    msgarr = msgarr.filter((val) => val !== "");
    return msgarr;
}
