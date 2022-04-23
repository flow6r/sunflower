var usrsInfo = null;
var usrsLstLimt = 20;
var usrsTotPages = null;
var usrsCurrPage = null;
var recsPageLimt = 5;
var usrIDAray = new Array();
var usrIDIndx = null;

/*查询用户*/
$("#content").on("click", "#usrMgtDiv #qryUsrMenuTbl #qryUsrRecsBtn", function () {
    let searchItem = $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrItem").val();
    let searchType = $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrType").val();

    if (searchItem != "") {
        $("#content").find("#usrMgtDiv").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
        $("#content").find("#usrMgtDiv").find(".qryRecsLstTbl").find("#usrRecsHead").siblings().remove();

        if (usrInfo["UsrRole"] === "tch") queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, usrInfo["MjrAbrv"], "MjrAbrv");
        else queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*实现查询用户的函数*/
function queryUsrs(usrRole, colgAbrv, mjrAbrv, trgtRole, searchItem, searchType) {
    $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrItem").val("");

    $.ajax({
        url: "../../library/common/query_usrs.php",
        type: "GET",
        async: false,
        data: {
            usrRole: usrRole, colgAbrv: colgAbrv, mjrAbrv: mjrAbrv,
            trgtRole: trgtRole, searchItem: searchItem, searchType: searchType
        },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (usrsJSON) {
            usrsInfo = usrsJSON;

            if (usrsInfo.length === 0) {
                alert("共0条用户记录");

                $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (usrsInfo.length <= usrsLstLimt) {
                usrsTotPages = 1;
                usrsCurrPage = 1;
            } else {
                usrsTotPages = parseInt(usrsInfo.length / usrsLstLimt);
                if (usrsInfo.length % usrsLstLimt) usrsTotPages++;
                usrsCurrPage = 1;
            }
            printUsrLsts(usrsCurrPage);
            printPageOpts(usrsCurrPage);
        }
    });
}

/*实现打印每页用户卡片的函数*/
function printUsrLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    usrIDAray = new Array();
    usrIDIndx = null;

    $("#content").find("#usrMgtDiv").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
    $("#content").find("#usrMgtDiv").find(".qryRecsLstTbl").find("#usrRecsHead").siblings().remove();

    begnIndx = (currPage - 1) * usrsLstLimt;
    endIndx = (currPage * usrsLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < usrsInfo.length; begnIndx++) {
        $("#content").find("#usrMgtDiv").find(".qryRecsLstTbl").find("#usrRecsHead").after(
            "<tr><td><input type='checkbox' class='usrCheckBox' value='" + usrsInfo[begnIndx].UsrID + "' /></td>" +
            "<td>" + usrsInfo[begnIndx].UsrID + "</td><td>" + usrsInfo[begnIndx].UsrName + "</td>" +
            "<td>" + (usrsInfo[begnIndx].UsrGen === "male" ? "男" : "女") + "</td>" +
            "<td><a href='mailto:" + usrsInfo[begnIndx].UsrEmail + "'>" + usrsInfo[begnIndx].UsrEmail + "</a></td>" +
            "<td><a href='#' id='" + usrsInfo[begnIndx].UsrID + "' class='usrDetlAnchor'>进入详情页</a></td></tr>"
        );
    }
}

/*实现打印页码选项的函数*/
function printPageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (usrsTotPages < recsPageLimt) {
        begnPage = 1;
        endPage = usrsTotPages;
    } else {
        if (currPage < recsPageLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % recsPageLimt);
            let pageQuot = parseInt(currPage / recsPageLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * recsPageLimt) + 1) : ((pageQuot * recsPageLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * recsPageLimt) : (((pageQuot + 1) * recsPageLimt)))
        }
    }

    $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' id='' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    if (currPage === 1) $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === usrsTotPages) $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("#usrMgtDiv #usrRecsPageCtlTbl #prevPage", function () {
    printUsrLsts(usrsCurrPage - 1);
    printPageOpts(usrsCurrPage - 1);
});

/*下一页*/
$("#content").on("#usrMgtDiv #usrRecsPageCtlTbl #nextPage", function () {
    printUsrLsts(usrsCurrPage + 1);
    printPageOpts(usrsCurrPage + 1);
});

/*获取选中的用户ID*/
$("#content").on("click", "#usrMgtDiv .qryUsrRecsDiv .qryRecsLstTbl .usrCheckBox", function (event) {
    let currUsrID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currUsrIDIndx = usrIDAray.indexOf(currUsrID);
        usrIDAray.splice(currUsrIDIndx, 1);
        usrIDIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        usrIDAray[usrIDIndx++] = currUsrID;
    }
});

/*批量删除用户记录*/
$("#content").on("click", "#usrMgtDiv #qryUsrMenuTbl #delRecsBtn", function () {
    if (usrIDAray.length != 0) {
        $.ajax({
            url: "../../library/common/delete_usrs.php",
            type: "POST",
            async: false,
            data: { usrRole: usrInfo["UsrRole"], usrIDAray: usrIDAray },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") alert("成功删除" + usrIDAray.length + "条用户记录");
                else alert(status);
            }
        });
    } else alert("您选择了0条用户记录，请选择至少一条记录后再执行批量删除操作");
});

