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

    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find("#qryUsrBarTbl").find("#qryUsrAnchor").siblings().remove();
    $("#content").find("#usrMgtDiv").find("#usrMgtFrm").find(".qryUsrRecsDiv").find(".qryRecsLstTbl").find("#usrRecsHead").siblings().remove();
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
$("#content").on("click", "#usrMgtDiv #usrMgtFrm #usrRecsPageCtlTbl #prevPage", function () {
    if(usrsCurrPage != 1) {
        usrsCurrPage--;
        printUsrLsts(usrsCurrPage);
        printPageOpts(usrsCurrPage);
    }
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