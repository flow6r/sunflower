var schedInfo = null;
var schedLstLimt = 20;
var schedTotPages = null;
var schedCurrPage = null;
var schedPageOptLimt = 5;
var schedIDAray = new Array();
var schedIDIndx = null;

/*查询课程*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #qrySchedMenuTbl #qrySchedRecsBtn", function () {
    let searchItem = $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("#qrySchedItem").val();
    let searchType = $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("#qrySchedType").val();

    if (searchItem != "") {
        $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#qrySchedAnchor").siblings().remove();
        $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find(".qryRecsLstTbl").empty();

        queryScheduleRecs(usrInfo["UsrID"], searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过导航标签查询课程记录*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #qrySchedBarTbl #qrySchedAnchor", function () {
    queryScheduleRecs(usrInfo["UsrID"], "", "CrseID");
});

/*实现查询所选课程的函数*/
function queryScheduleRecs(usrID, searchItem, searchType) {
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("#qrySchedItem").val();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("input").removeAttr("disabled");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("select").removeAttr("disabled");

    $.ajax({
        url: "../../library/common/query_scheds.php",
        type: "GET",
        async: false,
        data: { usrID: usrID, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (scedsJSON) {
            schedInfo = scedsJSON;

            $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#qrySchedAnchor").siblings().remove();

            $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").empty();
            $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").append("<table class='qryRecsLstTbl'></table>");

            $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='schedRecsHead'><th>课程ID</th><th>课程名称</th><th>讲师姓名</th><th>其他</th></tr>"
            );

            if (schedInfo.length === 0) {
                alert("共0条课程记录");

                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (schedInfo.length <= schedLstLimt) {
                schedTotPages = 1;
                schedCurrPage = 1;
            } else {
                schedTotPages = parseInt(schedInfo.length / schedLstLimt);
                if (schedInfo.length % schedLstLimt) schedTotPages++;
                schedCurrPage = 1;
            }
            printSchedLsts(schedCurrPage);
            printSchedPageOpts(schedCurrPage);
        }
    });
}

/*实现打印每页课程记录的函数*/
function printSchedLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    schedIDAray = new Array();
    schedIDIndx = null;

    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find(".qryRecsLstTbl").find("#schedRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * schedLstLimt;
    endIndx = (currPage * schedLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < schedInfo.length; begnIndx++) {
        $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find(".qryRecsLstTbl").append(
            "<tr><td>" + schedInfo[begnIndx].CrseID + "</td><td>" + schedInfo[begnIndx].CrseName + "</td>" +
            "<td>" + schedInfo[begnIndx].UsrName + "</td>" +
            "<td><a href='#' id='" + schedInfo[begnIndx].CrseID + "' class='schedDetlAnchor'>进入详情页</a></td></tr>"
        );
    }
}

/*实现打印页码选项的函数*/
function printSchedPageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (schedTotPages < schedPageOptLimt) {
        begnPage = 1;
        endPage = schedTotPages;
    } else {
        if (currPage < schedPageOptLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % schedPageOptLimt);
            let pageQuot = parseInt(currPage / schedPageOptLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * schedPageOptLimt) + 1) : ((pageQuot * schedPageOptLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * schedPageOptLimt) : (((pageQuot + 1) * schedPageOptLimt)))
        }
    }

    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === schedTotPages) $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#schedRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #schedRecsPageCtlTbl #prevPage", function () {
    if (schedCurrPage != 1) {
        schedCurrPage--;
        printSchedLsts(schedCurrPage);
        printSchedPageOpts(schedCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #schedRecsPageCtlTbl .pageOpt", function (event) {
    schedCurrPage = $(event.target).val();
    printSchedLsts(schedCurrPage);
    printSchedPageOpts(schedCurrPage);
});

/*下一页*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #schedRecsPageCtlTbl #nextPage", function () {
    if (schedCurrPage != schedTotPages) {
        schedCurrPage++;
        printSchedLsts(schedCurrPage);
        printSchedPageOpts(schedCurrPage);
    }
});

/*进入课程详情页*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv .schedDetlAnchor", function (event) {
    let crseID = $(event.target).attr("id");

    querySchedCrseInfo(crseID);
});

/*实现查询课程详情的函数*/
function querySchedCrseInfo(crseID) {
    $.ajax({
        url: "../../library/common/query_crse.php",
        type: "GET",
        async: false,
        data: { crseID: crseID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (crseJSON) {
            if (crseJSON["error"] === "查询课程失败，请联系管理员并反馈问题") alert("查询课程失败，请联系管理员并反馈问题");
            else {
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("input").attr("disabled", "disabled");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("select").attr("disabled", "disabled");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#qrySchedAnchor").siblings().remove();
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#qrySchedAnchor").after("<a id='crseInfoAnchor' class='" + crseID + "' href='#'>课程详情&gt;</a>");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".recsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").empty();
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").append(
                    "<table id='currSchedInfoTbl'><tr><td rowspan='4'><img src='' /></td>" +
                    "<td><label>课程名称</label></td><td><input type='text' id='crseName' name='crseName' maxlength='20' disabled='disabled' /></td>" +
                    "</tr><tr><td><label>讲师</label></td><td><input type='text' id='usrName' name='usrName' maxlength='20' disabled='disabled' /></td>" +
                    "</tr><tr><td><label>课程描述</label></td><td><textarea id='crseDesc' placeholder='' disabled='disabled'></textarea></td>" +
                    "</tr><tr><td colspan='2'><a id='qryStds' class='" + crseJSON[0].CrseID + "' href='#'>选课学生</a>&nbsp;<a id='qryMss' class='" + crseJSON[0].CrseID + "' href='#'>课程作业</a>&nbsp;" +
                    "</td></tr><tr><td><input type='button' id='createGrpBtn' name='" + crseJSON[0].CrseID + "' value='创建小组' /></td></tr></table>"
                );
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#currSchedInfoTbl").find("img").attr(
                    "src", (crseJSON[0].CoverPath === null ? "../image/crsefront/temp/meerkat.jpg" : crseJSON[0].CoverPath));
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#currSchedInfoTbl").find("#crseName").attr("placeholder", crseJSON[0].CrseName);
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#currSchedInfoTbl").find("#usrName").attr("placeholder", crseJSON[0].UsrName);
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#currSchedInfoTbl").find("#crseDesc").attr("placeholder", crseJSON[0].CrseDesc);
            }
        }
    });
}

/*通过导航栏查询课程详情*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #qrySchedBarTbl #crseInfoAnchor", function (event) {
    let crseID = $(event.target).attr("class");

    querySchedCrseInfo(crseID);
});

/*创建小组*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv #currSchedInfoTbl #createGrpBtn ", function (event) {
    let crseID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/check_member.php",
        type: "POST",
        async: false,
        data: { crseID: crseID, usrID: usrInfo["UsrID"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status != "exist") {
                $("#mask").attr("style", "visibility: visible;");
                $("body").append(
                    "<div id='createGrpDiv' name='createGrpDiv'><form id='createGrpFrm' name='createGrpFrm'><table id='createGrpTbl' name='createGrpFrm'>" +
                    "<tr><th colspan='4'>创建小组</th></tr>" +
                    "<tr><td colspan='1'><label>小组名称</label></td><td colspan='3'><input type='text' id='ptyName' name='ptyName' maxlength='50' /></td></tr>" +
                    "<tr><td><label>成员</label></td><td><label>职务</label></td></tr>" +
                    "<tr><td><input type='text' id='leader' name='leader' class='leader' value='" + usrInfo["UsrID"] + "' disabled='disabled' maxlength='15' /></td>" +
                    "<td><input type='text' id='leaderResp' name='leaderResp' class='leader' maxlength='15' /></td></tr>" +
                    "<tr><td><select id='mbr1' name='" + crseID + "' class='mbrID'></select></se></td>" +
                    "<td><input type='text' id='mbr1Resp' name='mbr1Resp' class='mbrResp' /></td></tr>" +
                    "<tr><td><select id='mbr2' name='" + crseID + "' class='mbrID'></select></se></td>" +
                    "<td><input type='text' id='mbr2Resp' name='mbr2Resp' class='mbrResp' /></td></tr>" +
                    "<tr><td><select id='mbr3' name='" + crseID + "' class='mbrID'></select></se></td>" +
                    "<td><input type='text' id='mbr3Resp' name='mbr3Resp' class='mbrResp' /></td></tr>" +
                    "<tr><td><select id='mbr4' name='" + crseID + "' class='mbrID'></select></se></td>" +
                    "<td><input type='text' id='mbr4Resp' name='mbr4Resp' class='mbrResp' /></td></tr>" +
                    "<tr><td><input type='button' id='cnlCreGrpBtn' name='" + crseID + "' value='取消' /></td>" +
                    "<td><input type='button' id='creGrpBtn' name='" + crseID + "' value='创建' /></td></tr></table></form></div>"
                );
            } else alert("抱歉，您无法创建小组");
        }
    })
});

/*取消创建小组*/
$("body").on("click", "#createGrpDiv #createGrpFrm #createGrpTbl #cnlCreGrpBtn", function (event) {
    $("#mask").attr("style", "visibility: hidden;");
    $("body").find("#createGrpDiv").remove();
});

/*查询可用ID*/
$("body").on("focusin", "#createGrpDiv #createGrpFrm #createGrpTbl .mbrID", function (event) {
    let crseID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_avlid.php",
        type: "GET",
        async: false,
        data: { crseID: crseID },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (usrIDJSON) {
            $(event.target).empty();
            for (let indx = 0; indx < usrIDJSON.length; indx++)
                $(event.target).append("<option value='" + usrIDJSON[indx].UsrID + "'>" + usrIDJSON[indx].UsrID + "</option>");
            $(event.target).find("option[value='" + usrInfo["UsrID"] + "']").remove();
        }
    });
});

/*检查小组名称完整性*/
$("body").on("focusout", "#createGrpDiv #createGrpFrm #createGrpTbl #ptyName", function () {
    let ptyName = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#ptyName").val();

    if (ptyName == "") $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#ptyName").attr("placeholder", "请输入小组名称");
    else $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#ptyName").removeAttr("placehodler");
});

/*检查组长职务完整性*/
$("body").on("focusout", "#createGrpDiv #createGrpFrm #createGrpTbl #leaderResp", function () {
    let leaderResp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#leaderResp").val();

    if (leaderResp == "") $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#leaderResp").attr("placeholder", "请输入组长职务");
    else $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#leaderResp").removeAttr("placehodler");
});

/*检查组员职务完整性*/
$("body").on("focusout", "#createGrpDiv #createGrpFrm #createGrpTbl .mbrResp", function (event) {
    let ptyName = $(event.target).val();

    if (ptyName == "") $(event.target).attr("placeholder", "请输入组员职务");
    else $(event.target).removeAttr("placeholder");
});

/*实现创建小组的函数*/
$("body").on("click", "#createGrpDiv #createGrpFrm #createGrpTbl #creGrpBtn", function (event) {
    let crseID = $(event.target).attr("name");
    let ptyName = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#ptyName").val();
    let leaderID = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#leader").val();
    let leaderResp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("#leaderResp").val();
    let mbr1ID = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("select[id='mbr1']").val();
    let mbr2ID = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("select[id='mbr2']").val();
    let mbr3ID = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("select[id='mbr3']").val();
    let mbr4ID = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("select[id='mbr4']").val();
    let mbr1Resp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("input[id='mbr1Resp']").val();
    let mbr2Resp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("input[id='mbr2Resp']").val();
    let mbr3Resp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("input[id='mbr3Resp']").val();
    let mbr4Resp = $("body").find("#createGrpDiv").find("#createGrpFrm").find("#createGrpTbl").find("input[id='mbr4Resp']").val();

    if (ptyName != "" && leaderResp != "" && mbr1ID != "" && mbr2ID != "" && mbr3ID != "" && mbr4ID != "" &&
        mbr1Resp != "" && mbr2Resp != "" && mbr3Resp != "" && mbr4Resp != "") {
        $.ajax({
            url: "../../library/common/create_pty.php",
            type: "POST",
            async: false,
            data: {
                crseID: crseID, ptyName: ptyName, leaderID: leaderID, leaderResp: leaderResp,
                mbr1ID: mbr1ID, mbr2ID: mbr2ID, mbr3ID: mbr3ID, mbr4ID: mbr4ID,
                mbr1Resp: mbr1Resp, mbr2Resp: mbr2Resp, mbr3Resp: mbr3Resp, mbr4Resp: mbr4Resp
            },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功创建小组");
                    $("#mask").attr("style", "visibility: hidden;");
                    $("body").find("#createGrpDiv").remove();
                } else alert(status);
            }
        });
    } else alert("请完善小组信息");
});

/*查询选课学生*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv #currSchedInfoTbl #qryStds", function (event) {
    let crseID = $(event.target).attr("class");

    let stdRecsTblWidth = $("#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv").innerWidth();
    let stdRecsTblHeight = $("#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv").innerHeight();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseInfoAnchor").nextAll().remove();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseInfoAnchor").after("<a href='#'>选课学生&gt;</a>");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#currSchedInfoTbl").remove();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").append(
        "<div id='crseStdRecsDiv'><table id='crseStdRecsTbl'>" +
        "<tr><th>学号</th><th>姓名</th><th>性别</th><th>电子邮箱</th></tr></table></div>"
    );
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseStdRecsDiv").attr("style", "width: " + stdRecsTblWidth + "px;");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseStdRecsDiv").attr("style", "height: " + stdRecsTblHeight + "px;");

    $.ajax({
        url: "../../library/common/query_crse_stds.php",
        type: "GET",
        async: false,
        data: { crseID: crseID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (crseStdsJSON) {
            if (crseStdsJSON.length === 0) alert("该课程共0个学生选择");
            else {
                for (let indx = 0; indx < crseStdsJSON.length; indx++)
                    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseStdRecsDiv").find("#crseStdRecsTbl").append(
                        "<tr><td>" + crseStdsJSON[indx].UsrID + "</td><td>" + crseStdsJSON[indx].UsrName + "</td>" +
                        "<td>" + (crseStdsJSON[indx].UsrGen === "male" ? "男" : "女") +
                        "</td><td><a href='mailto:" + crseStdsJSON[indx].UsrEmail + "'>" + crseStdsJSON[indx].UsrEmail + "</a></td></tr>"
                    );
            }
        }
    });
});

/*查询课程任务*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv #currSchedInfoTbl #qryMss", function (event) {
    let crseID = $(event.target).attr("class");

    querySchedMS(crseID);
});

/*通过导航栏实现查询课程任务记录*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #qrySchedBarTbl #crseMsAnchor", function (event) {
    let crseID = $(event.target).attr("class");

    querySchedMS(crseID);
});

/*实现查询课程任务记录的函数*/
function querySchedMS(crseID) {
    let msRecsTblWidth = $("#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv").innerWidth();
    let msRecsTblHeight = $("#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv").innerHeight();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseInfoAnchor").nextAll().remove();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseInfoAnchor").after("<a id='crseMsAnchor' class='" + crseID + "' href='#'>课程任务&gt;</a>");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").empty();
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").append(
        "<div id='crseMsRecsDiv'><table id='crseMsRecsTbl'>" +
        "<tr><th>任务ID</th><th>任务名称</th><th>创建者</th><th class='otherOpts'>其他操作</th></tr></table></div>"
    );
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseMsRecsDiv").attr("style", "width: " + msRecsTblWidth + "px;");
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseMsRecsDiv").attr("style", "height: " + msRecsTblHeight + "px;");

    $.ajax({
        url: "../../library/common/query_crse_ms.php",
        type: "GET",
        async: false,
        data: { crseID: crseID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (crseMsJSON) {
            if (crseMsJSON.length === 0) alert("该课程共0条课程任务记录");
            else {
                for (let indx = 0; indx < crseMsJSON.length; indx++)
                    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").find("#crseMsRecsDiv").find("#crseMsRecsTbl").append(
                        "<tr><td>" + crseMsJSON[indx].MsID + "</td><td>" + crseMsJSON[indx].MsName + "</td>" +
                        "<td>" + crseMsJSON[indx].UsrName + "</td><td><a class='" + crseMsJSON[indx].MsID + "' href='#'>" + "详情" + "</a></td></tr>"
                    );
            }
        }
    });
}

/*显示课程任务详情*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm .qrySchedRecsDiv #crseMsRecsDiv #crseMsRecsTbl a", function (event) {
    let msID = $(event.target).attr("class");

    querySchedMsDelt(msID);
});

/*通过导航栏查询课程任务详情*/
$("#content").on("click", "#schedMgtDiv #schedMgtFrm #qrySchedBarTbl #msDeltAnchor", function (event) {
    let msID = $(event.target).attr("class");

    querySchedMsDelt(msID);
});

/*实现查询任务详情的函数*/
function querySchedMsDelt(msID) {
    $.ajax({
        url: "../../library/common/query_msinfo.php",
        type: "GET",
        async: false,
        data: { msID: msID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (msJSON) {
            if (msJSON["error"] === "查询任务详情失败，请联系管理员并反馈问题") alert("查询任务详情失败，请联系管理员并反馈问题");
            else {
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseMsAnchor").nextAll().remove();
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedBarTbl").find("#crseMsAnchor").after("<a id='msDeltAnchor' class='" + msID + "' href='#'>任务详情&gt;</a>");
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").empty();
                $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find(".qrySchedRecsDiv").append(
                    "<table id='msDeltTbl'>" +
                    "<tr><td><label>任务名称</label></td><td><input type='text' id='msName' name='msName' disabled='disabled' placeholder='" + msJSON[0].MsName + "' maxlength='100' /></td></tr>" +
                    "<tr><td><label>任务描述</label></td><td><textarea id='msDesc' name='msDesc' placeholder='" + msJSON[0].MsDesc + "' disabled='disabled'></textarea></td></tr>" +
                    "<tr><td colspan='2' style='text-align: center;'><a href='" + msJSON[0].PkgPath + "'>" + "下载任务资源包" + "</td></a></tr></table>"
                );
            }
        }
    });
}