var ptyInfo = null;
var ptyLstLimt = 20;
var ptyTotPages = null;
var ptyCurrPage = null;
var ptyPageOptLimt = 5;
var ptyIDAray = new Array();
var ptyIDIndx = null;

/*查询小组记录*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #qryPtyMenuTbl #qryPtyRecsBtn", function () {
    let searchItem = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("#qryPtyItem").val();
    let searchType = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("#qryPtyType").val();

    if (searchItem != "") {
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyBarTbl").find("#qryPtyAnchor").siblings().remove();
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").empty();

        queryPartyRecs(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过导航标签查询小组记录*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #qryPtyBarTbl #qryPtyAnchor", function () {
    queryPartyRecs(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "PtyName");
});

/*实现查询小组记录的函数*/
function queryPartyRecs(usrID, usrRole, colgAbrv, mjrAbrv, searchItem, searchType) {
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("#qryPtyItem").val();
    // $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("input").removeAttr("disabled");
    // $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("select").removeAttr("disabled");

    $.ajax({
        url: "../../library/common/query_ptys.php",
        type: "GET",
        async: false,
        data: {
            usrID: usrID, usrRole: usrRole, colgAbrv: colgAbrv,
            mjrAbrv: mjrAbrv, searchItem: searchItem, searchType: searchType
        },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (ptyJSON) {
            ptyInfo = ptyJSON;

            $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyBarTbl").find("#qryPtyAnchor").siblings().remove();

            $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").empty();
            $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").append("<table class='qryRecsLstTbl'></table>");

            $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='ptyRecsHead'><th id='checkboxhead' wdith='50px'></th><th>小组ID</th><th>小组名称</th><th>组长</th><th>其他</th></tr>"
            );

            if (usrInfo["UsrRole"] === "std") $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").find("th[id='checkboxhead']").remove();

            if (ptyInfo.length === 0) {
                alert("共0条小组记录");

                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (ptyInfo.length <= ptyLstLimt) {
                ptyTotPages = 1;
                ptyCurrPage = 1;
            } else {
                ptyTotPages = parseInt(ptyInfo.length / ptyLstLimt);
                if (ptyInfo.length % ptyLstLimt) ptyTotPages++;
                ptyCurrPage = 1;
            }
            if (ptyInfo.length != 0) {
                printPtyLsts(ptyCurrPage);
                printPtyPageOpts(ptyCurrPage);
            }
        }
    });
}

/*实现打印每页课程记录的函数*/
function printPtyLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    ptyIDAray = new Array();
    ptyIDIndx = null;

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").find("#ptyRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * ptyLstLimt;
    endIndx = (currPage * ptyLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < ptyInfo.length; begnIndx++) {
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").append(
            "<tr><td class='checkboxtd'><input type='checkbox' class='ptyCheckBox' value='" + ptyInfo[begnIndx].PtyID + "' /></td>" +
            "<td>" + ptyInfo[begnIndx].PtyID + "</td><td>" + ptyInfo[begnIndx].PtyName + "</td>" +
            "<td>" + ptyInfo[begnIndx].UsrName + "</td>" +
            "<td><a href='#' id='" + ptyInfo[begnIndx].PtyID + "' class='ptyAnchor'>进入详情页</a></td></tr>"
        );
    }

    if (usrInfo["UsrRole"] === "std") {
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").find("input[type='checkbox']").remove();
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find(".qryRecsLstTbl").find("td[class='checkboxtd']").remove();
    }
}

/*实现打印页码选项的函数*/
function printPtyPageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (ptyTotPages < ptyPageOptLimt) {
        begnPage = 1;
        endPage = ptyTotPages;
    } else {
        if (currPage < ptyPageOptLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % ptyPageOptLimt);
            let pageQuot = parseInt(currPage / ptyPageOptLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * ptyPageOptLimt) + 1) : ((pageQuot * ptyPageOptLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * ptyPageOptLimt) : (((pageQuot + 1) * ptyPageOptLimt)))
        }
    }

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === ptyTotPages) $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#ptyRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #ptyRecsPageCtlTbl #prevPage", function () {
    if (ptyCurrPage != 1) {
        ptyCurrPage--;
        printPtyLsts(ptyCurrPage);
        printPtyPageOpts(ptyCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #ptyRecsPageCtlTbl .pageOpt", function (event) {
    ptyCurrPage = $(event.target).val();
    printPtyLsts(ptyCurrPage);
    printPtyPageOpts(ptyCurrPage);
});

/*下一页*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #ptyRecsPageCtlTbl #nextPage", function () {
    if (ptyCurrPage != ptyTotPages) {
        ptyCurrPage++;
        printPtyLsts(ptyCurrPage);
        printPtyPageOpts(ptyCurrPage);
    }
});

/*获取选中的小组ID*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv .qryRecsLstTbl .ptyCheckBox", function (event) {
    let currPtyID = $(event.target).val();
    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currPtyIDIndx = ptyIDAray.indexOf(currPtyID);
        ptyIDAray.splice(currPtyIDIndx, 1);
        ptyIDIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        ptyIDAray[ptyIDIndx++] = currPtyID;
    }
});

/*批量删除小组记录*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm #qryPtyMenuTbl #delRecsBtn", function () {
    if (ptyIDAray.length != 0) {
        $.ajax({
            url: "../../library/common/delete_ptys.php",
            type: "POST",
            async: false,
            data: { ptyIDAray: ptyIDAray, usrRole: usrInfo["UsrRole"] },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功删除" + ptyIDAray.length + "条小组记录")
                    queryPartyRecs(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "PtyName");
                } else alert(status);
            }
        });
    } else alert("您选择了0条小组记录，请选择至少一条记录后再执行批量删除操作");
});


/*显示课程任务详情*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv .qryRecsLstTbl a", function (event) {
    let ptyID = $(event.target).attr("id");

    queryPtyDetl(ptyID);
});

/*实现查询任务详情的函数*/
function queryPtyDetl(ptyID) {
    $.ajax({
        url: "../../library/common/query_ptyinfo.php",
        type: "GET",
        async: false,
        data: { ptyID: ptyID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (ptyJSON) {
            if (ptyJSON.length === 0) alert("查询小组详情失败，请联系管理员并反馈问题");
            else {
                ptyIDAray = new Array();
                ptyIDIndx = null;
                // $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("input").attr("disabled", "disabled");
                // $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyMenuTbl").find("select").attr("disabled", "disabled");
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyBarTbl").find("#qryPtyAnchor").nextAll().remove();
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find("#qryPtyBarTbl").find("#qryPtyAnchor").after("<a class='" + ptyID + "' href='#'>小组详情&gt;</a>");
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".recsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").empty();
                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").append(
                    "<table id='ptyInfoTbl'><tr><td><label>小组名称</label></td><td><input type='text' id='ptyName' name='ptyName' value='" + ptyJSON[0].PtyName + "' maxlength='50' /></td>" +
                    "<td><label>隶属课程</label></td><td><input type='text' id='crseName' name='crseName' value='" + ptyJSON[0].CrseName + "' maxlength='20' /></td></tr><tr>" +
                    "<td><label>组长姓名</label></td><td><input type='text' id='leaderName' name='leaderName' value='" + ptyJSON[0].UsrName + "' maxlength='20' /></td>" +
                    "<td><label>组长职务</label></td><td><input type='text' id='leaderResp' name='" + ptyJSON[0].UsrID + "' value='" + ptyJSON[0].UsrResp + "' class='editable' /></td></tr><tr>" +
                    "<td><label>组员姓名</label></td><td><input type='text' id='mbr1Name' name='mbr1Name' value='" + ptyJSON[1].UsrName + "' maxlength='20' /></td>" +
                    "<td><label>组员职务</label></td><td><input type='text' id='mbr1Resp' name='" + ptyJSON[1].UsrID + "' value='" + ptyJSON[1].UsrResp + "' class='editable' /></td></tr><tr>" +
                    "<td><label>组员姓名</label></td><td><input type='text' id='mbr2Name' name='mbr2Name' value='" + ptyJSON[2].UsrName + "' maxlength='20' /></td>" +
                    "<td><label>组员职务</label></td><td><input type='text' id='mbr2Resp' name='" + ptyJSON[2].UsrID + "' value='" + ptyJSON[2].UsrResp + "' class='editable' /></td></tr><tr>" +
                    "<td><label>组员姓名</label></td><td><input type='text' id='mbr3Name' name='mbr3Name' value='" + ptyJSON[3].UsrName + "' maxlength='20' /></td>" +
                    "<td><label>组员职务</label></td><td><input type='text' id='mbr3Resp' name='" + ptyJSON[3].UsrID + "' value='" + ptyJSON[3].UsrResp + "' class='editable' /></td></tr><tr>" +
                    "<td><label>组员姓名</label></td><td><input type='text' id='mbr4Name' name='mbr4Name' value='" + ptyJSON[4].UsrName + "' maxlength='20' /></td>" +
                    "<td><label>组员职务</label></td><td><input type='text' id='mbr4Resp' name='" + ptyJSON[4].UsrID + "' value='" + ptyJSON[4].UsrResp + "' class='editable' /></td>" +
                    "</tr><tr><td><input type='button' id='editPtyInfoBtn' name='" + ptyJSON[0].PtyID + "' value='编辑' /></td>" +
                    "<td><input type='button' id='cnlEditPtyInfoBtn' name='" + ptyJSON[0].PtyID + "' value='取消' />" +
                    "<input type='button' id='updtPtyInfoBtn' name='" + ptyJSON[0].PtyID + "' value='更新' /></td>" +
                    "<td colspan='2'><input type='button' id='delPtyBtn' name='" + ptyJSON[0].PtyID + "' value='删除小组' /></td></tr></table>"
                );

                $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("input[type='text']").attr("disabled", "disabled");
                if (usrInfo["UsrID"] != ptyJSON[0].UsrID && usrInfo["UsrRole"] === "std")
                    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("input[type='button']").remove();
            }
        }
    });
}

/*编辑小组信息*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl #editPtyInfoBtn", function (event) {
    let ptyID = $(event.target).attr("name");

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#ptyName").removeAttr("disabled");
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("input[class='editable']").removeAttr("disabled");

    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#editPtyInfoBtn").remove();
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#delPtyBtn").remove();
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#cnlEditPtyInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#updtPtyInfoBtn").attr("style", "visibility: visible;");
});

/*取消更新小组信息*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl #cnlEditPtyInfoBtn", function (event) {
    let ptyID = $(event.target).attr("name");

    queryPtyDetl(ptyID);
});

/*更新小组信息时检查小组名称完整新*/
$("#content").on("focusout", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl #ptyName", function () {
    let ptyName = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#ptyName").val();

    if (ptyName == "") $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#ptyName").attr("placeholder", "请输入小组名称");
    else $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#ptyName").removeAttr("placeholder");
});

/*更新小组信息时检查组员职务完整新*/
$("#content").on("focusout", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl .editable", function (event) {
    let ptyName = $(event.target).val();

    if (ptyName == "") $(event.target).attr("placeholder", "请输入职务信息");
    else $(event.target).removeAttr("placeholder");
});

/*实现更新小组信息的函数*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl #updtPtyInfoBtn", function (event) {
    let ptyID = $(event.target).attr("name");
    let ptyName = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#ptyName").val();
    let leaderID = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#leaderResp").attr("name");
    let leaderResp = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#leaderResp").val()
    let mbr1ID = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr1Resp").attr("name");
    let mbr1Resp = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr1Resp").val()
    let mbr2ID = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr2Resp").attr("name");
    let mbr2Resp = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr2Resp").val()
    let mbr3ID = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr3Resp").attr("name");
    let mbr3Resp = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr3Resp").val()
    let mbr4ID = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr4Resp").attr("name");
    let mbr4Resp = $("#content").find("#ptyMgtDiv").find("#ptyMgtFrm").find(".qryPtyRecsDiv").find("#ptyInfoTbl").find("#mbr4Resp").val()
    let IDAndResp = [[leaderID, leaderResp], [mbr1ID, mbr1Resp], [mbr2ID, mbr2Resp], [mbr3ID, mbr3Resp], [mbr4ID, mbr4Resp]];

    if (ptyID != "" && ptyName != "" && leaderID != "" && leaderResp != "" && mbr1ID != "" && mbr1Resp != "" && mbr2ID != "" && mbr2Resp != "" &&
        mbr3ID != "" && mbr3Resp != "" && mbr4ID != "" && mbr4Resp != "") {
        $.ajax({
            url: "../../library/common/update_ptyinfo.php",
            type: "POST",
            async: false,
            data: { ptyID: ptyID, ptyName: ptyName, IDAndResp: IDAndResp, usrRole: usrInfo["UsrRole"] },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功更新小组信息");
                    queryPtyDetl(ptyID);
                } else alert(status);
            }
        });
    } else alert("请完善信息后再执行更新操作");
});

/*实现删除小组记录的函数*/
$("#content").on("click", "#ptyMgtDiv #ptyMgtFrm .qryPtyRecsDiv #ptyInfoTbl #delPtyBtn", function (event) {
    let ptyID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/delete_pty.php",
        type: "POST",
        async: false,
        data: { ptyID: ptyID, usrRole: usrInfo["UsrRole"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") {
                alert("成功删除小组");
                queryPartyRecs(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "PtyName");
            } else alert(status);
        }
    });
});