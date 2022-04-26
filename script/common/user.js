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
        $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
        $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").empty();

        if (usrInfo["UsrRole"] === "tch") queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, usrInfo["MjrAbrv"], "MjrAbrv");
        else queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过用户导航标签查询用户*/
$("#content").on("click", "#usrMgtDiv #qryUsrBarTbl #qryUsrAnchor", function () {
    if (usrInfo["UsrRole"] === "tch")
        queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, usrInfo["MjrAbrv"], "MjrAbrv");
    else queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, "", "UsrID");
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

            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();

            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").empty();
            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").attr("class", "qryRecsLstTbl")

            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='usrRecsHead'><th width='50px'></th><th>用户ID</th><th>姓名</th><th>性别</th><th>电子邮箱</th><th>其他</th></tr>"
            );

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

/*实现打印每页用户记录的函数*/
function printUsrLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    usrIDAray = new Array();
    usrIDIndx = null;

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").find("#usrRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * usrsLstLimt;
    endIndx = (currPage * usrsLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < usrsInfo.length; begnIndx++) {
        $("#content").find("#usrMgtDiv").find(".qryRecsLstTbl").append(
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

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#usrRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === usrsTotPages) $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#usrMgtDiv").find("#usrRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm #usrRecsPageCtlTbl #prevPage", function () {
    if (usrsCurrPage != 1) {
        usrsCurrPage--;
        printUsrLsts(usrsCurrPage);
        printPageOpts(usrsCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm #usrRecsPageCtlTbl .pageOpt", function (event) {
    usrsCurrPage = $(event.target).val();
    printUsrLsts(usrsCurrPage);
    printPageOpts(usrsCurrPage);
});

/*下一页*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm #usrRecsPageCtlTbl #nextPage", function () {
    if (usrsCurrPage != usrsTotPages) {
        usrsCurrPage++;
        printUsrLsts(usrsCurrPage);
        printPageOpts(usrsCurrPage);
    }
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

/*显示添加新用户记录的弹窗*/
$("#content").on("click", "#usrMgtDiv #qryUsrMenuTbl #addRecBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='addRecDiv' class='usrMgtPopup'><form id='addRecFrm'><table id='addRecTbl'>" +
        "<tr><th colspan='2'><span id='addRecTitl'>新增学生用户</span></th></tr>" +
        "<tr><td><label>用户ID</label></td><td><input type='text' id='usrID' name='usrID' maxlength='15' /></td></tr>" +
        "<tr><td><label>姓名</label></td><td><input type='text' id='usrName' name='usrName' maxlength='10' /></td></tr>" +
        "<tr><td><label>性别</label></td><td><select id='usrGen' name='usrGen'></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='email' id='usrEmail' name='usrEmail' maxlength='100' /></td></tr>" +
        "<tr id='optRow'><td><label>入学年份</label></td><td><select id='usrAdms' name='usrAdms'></select></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='mjrAbrv' name='mjrAbrv'></select></td></tr>" +
        "<tr><td><input type='button' class='cnlBtn' value='取消' /></td>" +
        "<td><input type='button' id='addNewRecBtn' name='addNewRecBtn' value='新增' /></td></tr>" +
        "</table></form></div><div class='usrMgtPopupTips'><span></span></div>"
    );

    if (trgtRole === "tch") {
        $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#addRecTitl").empty().append("新增教师用户");
        $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#optRow").remove();
        $("body").find("#addRecDiv").attr("style", "height: 400px;");
        $("body").find("#addRecDiv").find("#addRecFrm").attr("style", "height: 400px;");
    }
});

/*添加用户时检查用户ID完整性*/
$("body").on("focusout", "#addRecDiv #addRecFrm #addRecTbl #usrID", function () {
    let usrID = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrID").val();

    if (usrID === "") $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrID").attr("placeholder", "请输入用户ID");
    else $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrID").removeAttr("placeholder");
});

/*添加用户时检查姓名完整性*/
$("body").on("focusout", "#addRecDiv #addRecFrm #addRecTbl #usrName", function () {
    let usrName = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrID").val();

    if (usrName === "") $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrName").attr("placeholder", "请输入姓名");
    else $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrName").removeAttr("placeholder");
});

/*添加用户时追加性别选项*/
$("body").on("focusin", "#addRecDiv #addRecFrm #addRecTbl #usrGen", function () {
    $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrGen").empty();
    $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrGen").append(
        "<option value='male'>男</option><option value='female'>女</option>"
    );
});

/*添加用户时检查电子邮箱ID完整性*/
$("body").on("focusout", "#addRecDiv #addRecFrm #addRecTbl #usrEmail", function () {
    let usrEmail = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrEmail").val();

    if (usrEmail === "") $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
    else $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrName").removeAttr("placeholder");
});

/*添加用户时追加入学年份选项*/
$("body").on("focusin", "#addRecDiv #addRecFrm #addRecTbl #usrAdms", function () {
    $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrAdms").empty();
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
});

/*添加用户时追加所在专业选项*/
$("body").on("focusin", "#addRecDiv #addRecFrm #addRecTbl #mjrAbrv", function () {
    $.ajax({
        url: "../../library/common/query_mjr.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"], colgAbrv: usrInfo["ColgAbrv"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (mjrJSON) {
            $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#mjrAbrv").empty();
            for (let indx = 0; indx < mjrJSON.length; indx++)
                $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#mjrAbrv").append(
                    "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                );
        }
    });
});

/*添加新用户*/
$("body").on("click", "#addRecDiv #addRecFrm #addRecTbl #addNewRecBtn", function () {
    let usrID = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrID").val();
    let usrName = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrName").val();
    let usrGen = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrGen").val();
    let usrEmail = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrEmail").val();
    let usrAdms = null;
    let mjrAbrv = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#mjrAbrv").val();

    if (trgtRole === "std") usrAdms = $("body").find("#addRecDiv").find("#addRecFrm").find("#addRecTbl").find("#usrAdms").val();

    $("body").find(".usrMgtPopupTips").find("span").empty();
    $("body").find(".usrMgtPopupTips").attr("style", "visibility: hidden;");

    if (usrID != "" && usrName != "" && usrGen != "" && usrEmail != "" && mjrAbrv != "") {
        if (trgtRole === "std" && usrAdms == null) {
            $("body").find(".usrMgtPopupTips").attr("style", "visibility: visible;");
            $("body").find(".usrMgtPopupTips").find("span").append("请完善用户信息");
        } else {
            $.ajax({
                url: "../../library/common/add_acct.php",
                type: "POST",
                async: false,
                data: {
                    usrRole: usrInfo["UsrRole"], usrID: usrID, usrName: usrName,
                    usrGen: usrGen, trgtRole: trgtRole, usrEmail: usrEmail,
                    usrAdms: usrAdms, colgAbrv: usrInfo["ColgAbrv"], mjrAbrv: mjrAbrv
                },
                error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                success: function (status) {
                    if (status === "successful") alert("成功添加新的用户记录");
                    else {
                        $("body").find(".usrMgtPopupTips").attr("style", "visibility: visible;");
                        $("body").find(".usrMgtPopupTips").find("span").append(status);
                    }

                    ReQueryUsrs();
                }
            });
        }
    } else {
        $("body").find(".usrMgtPopupTips").attr("style", "visibility: visible;");
        $("body").find(".usrMgtPopupTips").find("span").append("请完善用户信息");
    }
});

/*显示批量添加用户记录的弹窗*/
$("#content").on("click", "#usrMgtDiv #qryUsrMenuTbl #impRecsBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='impRecsDiv' name='impRecsDiv' class='usrMgtPopup'>" +
        "<form id='impRecsFrm' name='impRecsFrm' enctype='multipart/form-data' " +
        "action='../../library/common/import_stds.php' method='post' target='doNotRefresh' onsubmit='return checkTmplFile()'>" +
        "<table id='impRecsTbl' name='impRecsTbl'><tr><th colspan='2'><span>批量导入学生用户</span></th></tr>" +
        "<tr><th colspan='2'><a href='http://localhost/data/tmpl/StdUsrInfoTmpl.xlsx'>下载模板文件</a></th></tr>" +
        "<tr><td><label>用户信息文件</label></td><td><input type='file' id='usrInfoTmplFile' name='usrInfoTmplFile' /></td></tr>" +
        "<tr><td><input type='button' class='cnlBtn' value='取消' /></td>" +
        "<td><input type='submit' name='' class='impNewRecsBtn' value='导入' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );

    if (trgtRole === "tch") {
        $("body").find("#impRecsDiv").find("#impRecsFrm").find("#impRecsTbl").find("span").empty();
        $("body").find("#impRecsDiv").find("#impRecsFrm").find("#impRecsTbl").find("span").append("批量导入教师用户");
        $("body").find("#impRecsDiv").find("#impRecsFrm").attr("action", "../../library/common/import_tchs.php");
        $("body").find("#impRecsDiv").find("#impRecsFrm").find("#impRecsTbl").find("a").attr(
            "href", "http://localhost/data/tmpl/TchUsrInfoTmpl.xlsx"
        );
    }
});

/*实现检查模板文件的函数*/
function checkTmplFile() {
    let usrInfoTmplFile = $("body").find("#impRecsDiv").find("#impRecsFrm").find("#impRecsTbl").find("#usrInfoTmplFile").val();

    if (usrInfoTmplFile === "") {
        alert("请选择待导入的用户信息文件后再执行导入操作");
        return false;
    }

    return true;
}

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

                ReQueryUsrs();
            }
        });
    } else alert("您选择了0条用户记录，请选择至少一条记录后再执行批量删除操作");
});

/*关闭弹窗*/
$("body").on("click", ".usrMgtPopup .cnlBtn", function () {
    ReQueryUsrs();
});

/*实现重新查询的函数*/
function ReQueryUsrs() {
    $("#mask").attr("style", "visibility: hidden;");

    $("body").find(".usrMgtPopup").remove();
    $("body").find(".usrMgtPopupTips").remove();

    let searchItem = $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrItem").val();
    let searchType = $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrType").val();

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").empty();

    if (searchItem === "") {
        searchItem = "";
        searchType = "UsrID";
    }

    if (usrInfo["UsrRole"] === "tch") queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, usrInfo["MjrAbrv"], "MjrAbrv");
    else queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, searchItem, searchType);
}

/*进入用户详情页*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm .qryUsrRecsDiv .qryRecsLstTbl .usrDetlAnchor", function (event) {
    let usrID = $(event.target).attr("id");

    queryCurrUsrInfo(usrID);
});

/*实现查询用户信息详情的函数*/
function queryCurrUsrInfo(currUsrID) {
    let usrID = currUsrID;

    $.ajax({
        url: "../../library/common/query_usr.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"], usrID: usrID },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (usrJSON) {
            if (usrJSON["error"] === "查询用户失败，请联系管理员并反馈问题") alert("查询用户失败，请联系管理员并反馈问题");
            else {
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").after("<a href='#'>用户信息&gt;</a>");
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").empty();
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#usrRecsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").attr("class", "currUsrInfoTbl")

                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").append(
                    "<tr><td rowspan='8'><img id='usrAvatar' src='' /></td>" +
                    "<td><label>用户ID</label></td><td><input type='text' id='usrID' name='" + usrJSON[0].UsrID + "' maxlength='15' disabled='disabled' /></td></tr>" +
                    "<tr><td><label>姓名</label></td><td><input type='text' id='usrName' name='usrName' maxlength='10' disabled='disabled' /></td></tr>" +
                    "<tr><td><label>性别</label></td><td><select id='usrGen' name='usrGen' disabled='disabled'></select></td></tr>" +
                    "<tr><td><label>密码</label></td><td><input type='text' id='usrPasswd' name='usrPasswd' maxlength='18' disabled='disabled' title='密码由6~18位的英文字母、数字和特殊字符组成' /></td></tr>" +
                    "<tr><td><label>电子邮箱</label></td><td><input type='email' id='usrEmail' name='" + usrJSON[0].UsrEmail + "' maxlength='100' disabled='disabled' /></td></tr>" +
                    "<tr><td><label>入学年份</label></td><td><select id='usrAdms' name='usrAdms' disabled='disabled'></select></td></tr>" +
                    "<tr><td><label>隶属学院</label></td><td><select id='colgAbrv' name='colgAbrv' disabled='disabled'></select></td></tr>" +
                    "<tr><td><label>所在专业</label></td><td><select id='mjrAbrv' name='mjrAbrv' disabled='disabled'></select></td></tr>" +
                    "<tr><td><input type='button' id='updtAvatar' name='" + usrJSON[0].UsrID + "' value='更新头像' /></td>" +
                    "<td><input type='button' id='editUsrInfoBtn' name='editUsrInfoBtn' value='编辑' />" +
                    "</td><td><input type='button' id='cnlUpdtUsrInfoBtn' name='" + usrJSON[0].UsrID + "' value='取消' />" +
                    "<input type='button' id='updtUsrInfoBtn' name='updtUsrInfoBtn' value='保存' /></td></tr>"
                );
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("img").attr("src", (usrJSON[0].AvatarPath === null ? "../../image/avatar/temp/flower.jpg" : usrJSON[0].AvatarPath));
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").attr("placeholder", usrJSON[0].UsrID);
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").attr("placeholder", usrJSON[0].UsrName);
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrGen").append("<option value='male'>男</option><option value='female'>女</option>");
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrGen").find("option[value='" + usrJSON[0].UsrGen + "']").attr("selected", "selected");
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrPasswd").attr("value", "**********");
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrEmail").attr("placeholder", usrJSON[0].UsrEmail);
                if (usrJSON[0].UsrAdms != null)
                    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").append(
                        "<option value='" + usrJSON[0].UsrAdms + "'>" + usrJSON[0].UsrAdms + "</option>");
                else $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").append("<option value='null'>暂无</option>");

                $.ajax({
                    url: "../../library/common/query_colg.php",
                    type: "GET",
                    async: false,
                    data: { usrRole: usrInfo["UsrRole"] },
                    dataType: "json",
                    error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                    success: function (colgJSON) {
                        for (let indx = 0; indx < colgJSON.length; indx++) {
                            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#colgAbrv").append(
                                "<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>"
                            );
                        }
                        $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#colgAbrv").find("option[value='" + usrJSON[0].ColgAbrv + "']").attr("selected", "selected");
                        if (usrJSON[0].MjrAbrv != null) {
                            $.ajax({
                                url: "../../library/common/query_mjr.php",
                                type: "GET",
                                async: false,
                                data: { usrRole: usrInfo["UsrRole"], colgAbrv: usrJSON[0].ColgAbrv },
                                dataType: "json",
                                error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                                success: function (mjrJSON) {
                                    for (let indx = 0; indx < mjrJSON.length; indx++) {
                                        $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").append(
                                            "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                                        );
                                    }
                                    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").find("option[value='" + usrJSON[0].MjrAbrv + "']").attr("selected", "selected");
                                }
                            });
                        } else $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").append("<option value='null'>暂无</option>");
                    }
                });
            }
        }
    })
}

/*编辑用户信息*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm .qryUsrRecsDiv .currUsrInfoTbl #editUsrInfoBtn", function () {
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#updtAvatar").attr("disabled", "disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#editUsrInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#cnlUpdtUsrInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#updtUsrInfoBtn").attr("style", "visibility: visible;");

    let currUsrID = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").attr("placeholder");
    let currUsrName = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").attr("placeholder");
    let currUsrEmail = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrEmail").attr("placeholder");
    let currUsrAdms = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").val();

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").val(currUsrID).removeAttr("placeholder").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").val(currUsrName).removeAttr("placeholder").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrPasswd").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrEmail").val(currUsrEmail).removeAttr("placeholder").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrGen").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").removeAttr("disabled").empty();

    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").append("<option value='null'>暂无</option>");
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").find("option[value='" + currUsrAdms + "']").attr("selected", "selected");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#colgAbrv").removeAttr("disabled");
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").removeAttr("disabled");
});

/*切换学院时查询该学院下设专业*/
$("#content").on("change", "#usrMgtDiv #usrMgtFrm .qryUsrRecsDiv .currUsrInfoTbl #colgAbrv", function () {
    let colgAbrv = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#colgAbrv").val();

    $.ajax({
        url: "../../library/common/query_mjr.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"], colgAbrv: colgAbrv },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (mjrJSON) {
            $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").empty();
            for (let indx = 0; indx < mjrJSON.length; indx++) {
                $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").append(
                    "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                );
            }
        }
    });
});

/*检查用户ID完整性*/
$("#content").on("focusout", "#usrMgtDiv #usrMgtFrm, .qryUsrRecsDiv .currUsrInfoTbl #usrID", function () {
    let usrID = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").val();

    if (usrID == "") $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").attr("placeholder", "请输入用户ID");
    else $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").removeAttr("placeholder");
});

/*检查姓名完整性*/
$("#content").on("focusout", "#usrMgtDiv #usrMgtFrm, .qryUsrRecsDiv .currUsrInfoTbl #usrName", function () {
    let usrName = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").val();

    if (usrName == "") $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").attr("placeholder", "请输入姓名");
    else $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").removeAttr("placeholder");
});

/*检查密码完整性*/
$("#content").on("focusout", "#usrMgtDiv #usrMgtFrm, .qryUsrRecsDiv .currUsrInfoTbl #usrPasswd", function () {
    let usrPasswd = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrPasswd").val();

    if (usrPasswd == "") $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrPasswd").attr("placeholder", "请输入6~18位密码");
    else $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").removeAttr("placeholder");
});

/*取消编辑用户信息*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm .qryUsrRecsDiv .currUsrInfoTbl #cnlUpdtUsrInfoBtn", function (event) {
    let usrID = $(event.target).attr("name");

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").empty();

    queryCurrUsrInfo(usrID);
});

/*保存更改并更新用户信息*/
$("#content").on("click", "#usrMgtDiv #usrMgtFrm .qryUsrRecsDiv .currUsrInfoTbl #updtUsrInfoBtn", function () {
    let origID = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").attr("name");
    let usrID = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrID").val();
    let usrName = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrName").val();
    let usrGen = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrGen").val();
    let usrPasswd = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrPasswd").val();
    let origEmail = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrEmail").attr("name");
    let usrEmail = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrEmail").val();
    let usrAdms = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#usrAdms").val();
    let colgAbrv = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#colgAbrv").val();
    let mjrAbrv = $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").find("#mjrAbrv").val();

    // alert(usrID + "," + usrName + "," + usrGen + "," + usrPasswd + "," + usrEmail + "," + usrAdms + "," + colgAbrv + "," + mjrAbrv);

    if (usrID != "" && usrName != "" && usrGen != "" && usrPasswd != "" && usrEmail != "" && colgAbrv != "" && mjrAbrv) {
        $.ajax({
            url: "../../library/common/update_usrinfo.php",
            type: "POST",
            async: false,
            data: {
                origID: origID, usrID: usrID, usrName: usrName, usrGen: usrGen, usrPasswd: usrPasswd, origEmail: origEmail,
                usrEmail: usrEmail, usrAdms: usrAdms, colgAbrv: colgAbrv, mjrAbrv: mjrAbrv, usrRole: usrInfo["UsrRole"]
            },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功更新用户信息");
                    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".currUsrInfoTbl").empty();
                    queryCurrUsrInfo(usrID);
                } else alert(status);
            }
        });
    } else alert("请完善待更改的用户信息后再执行更新操作");


});