var msInfo = null;
var msLstLimt = 20;
var msTotPages = null;
var msCurrPage = null;
var msPageOptLimt = 5;
var msIDAray = new Array();
var msIDIndx = null;

/*查询课程*/
$("#content").on("click", "#msMgtDiv #msMgtFrm #qryMsMenuTbl #qryMsRecsBtn", function () {
    let searchItem = $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsMenuTbl").find("#qryMsItem").val();
    let searchType = $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsMenuTbl").find("#qryMsType").val();

    if (searchItem != "") {
        $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsBarTbl").find("#qryMsAnchor").siblings().remove();
        $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").find(".qryRecsLstTbl").empty();

        queryStdMsRecs(usrInfo["UsrID"], searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过导航标签查询课程记录*/
$("#content").on("click", "#msMgtDiv #msMgtFrm #qryMsBarTbl #qryMsAnchor", function () {
    queryStdMsRecs(usrInfo["UsrID"], "", "MsName");
});

/*实现查询所选课程的函数*/
function queryStdMsRecs(usrID, searchItem, searchType) {
    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsMenuTbl").find("#qryMsItem").val();
    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsMenuTbl").find("input").removeAttr("disabled");

    $.ajax({
        url: "../../library/common/query_ms.php",
        type: "GET",
        async: false,
        data: { usrID: usrID, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (msJSON) {
            msInfo = msJSON;

            $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsBarTbl").find("#qryMsAnchor").siblings().remove();

            $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").empty();
            $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").append("<table class='qryRecsLstTbl'></table>");

            $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='msRecsHead'><th>任务ID</th><th>任务名称</th><th>发布人</th><th>完成状态</th><th>其他</th></tr>"
            );

            if (msInfo.length === 0) {
                alert("共0条课程记录");

                $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (msInfo.length <= msLstLimt) {
                msTotPages = 1;
                msCurrPage = 1;
            } else {
                msTotPages = parseInt(msInfo.length / msLstLimt);
                if (msInfo.length % msLstLimt) msTotPages++;
                msCurrPage = 1;
            }
            printMsLsts(msCurrPage);
            printMsPageOpts(msCurrPage);
        }
    });
}

/*实现打印每页课程记录的函数*/
function printMsLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    msIDAray = new Array();
    msIDIndx = null;

    $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").find(".qryRecsLstTbl").find("#msRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * msLstLimt;
    endIndx = (currPage * msLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < msInfo.length; begnIndx++) {
        $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").find(".qryRecsLstTbl").append(
            "<tr><td>" + msInfo[begnIndx].MsID + "</td><td>" + msInfo[begnIndx].MsName + "</td>" +
            "<td>" + msInfo[begnIndx].UsrName + "</td><td>" + (msInfo[begnIndx].MsStat === "incmpl" ? "未完成" : "已完成") + "</td>" +
            "<td><a href='#' id='" + msInfo[begnIndx].MsID + "' class='msDetlAnchor'>进入详情页</a></td></tr>"
        );
    }
}

/*实现打印页码选项的函数*/
function printMsPageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (msTotPages < msPageOptLimt) {
        begnPage = 1;
        endPage = msTotPages;
    } else {
        if (currPage < msPageOptLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % msPageOptLimt);
            let pageQuot = parseInt(currPage / msPageOptLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * msPageOptLimt) + 1) : ((pageQuot * msPageOptLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * msPageOptLimt) : (((pageQuot + 1) * msPageOptLimt)))
        }
    }

    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === msTotPages) $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#msRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#msMgtDiv #msMgtFrm #msRecsPageCtlTbl #prevPage", function () {
    if (msCurrPage != 1) {
        msCurrPage--;
        printMsLsts(msCurrPage);
        printMsPageOpts(msCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#msMgtDiv #msMgtFrm #msRecsPageCtlTbl .pageOpt", function (event) {
    msCurrPage = $(event.target).val();
    printMsLsts(msCurrPage);
    printMsPageOpts(msCurrPage);
});

/*下一页*/
$("#content").on("click", "#msMgtDiv #msMgtFrm #msRecsPageCtlTbl #nextPage", function () {
    if (msCurrPage != msTotPages) {
        msCurrPage++;
        printMsLsts(msCurrPage);
        printMsPageOpts(msCurrPage);
    }
});

/*显示课程任务详情*/
$("#content").on("click", "#msMgtDiv #msMgtFrm .qryMsRecsDiv .qryRecsLstTbl a", function (event) {
    let msID = $(event.target).attr("id");

    queryStdMsDelt(msID);
});

/*实现查询任务详情的函数*/
function queryStdMsDelt(msID) {
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
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsBarTbl").find("#qryMsAnchor").nextAll().remove();
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find("#qryMsBarTbl").find("#qryMsAnchor").after("<a class='" + msID + "' href='#'>任务详情&gt;</a>");
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".recsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").empty();
                $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").append(
                    "<table id='msDeltTbl'>" +
                    "<tr><td><label>任务名称</label></td><td><input type='text' id='msName' name='msName' disabled='disabled' placeholder='" + msJSON[0].MsName + "' maxlength='100' /></td></tr>" +
                    "<tr><td><label>任务描述</label></td><td><textarea id='msDesc' name='msDesc' placeholder='" + msJSON[0].MsDesc + "' disabled='disabled'></textarea></td></tr>" +
                    "<tr><td><label>完成状态</label></td><td><input type='text' id='msStat' name='msStat' disabled='disabled' placeholder='" + (msJSON[0].MsStat === "cmpled" ? "已完成" : "未完成") + "' /></td></tr>" +
                    "<tr><td colspan='2' style='text-align: center;'><a href='" + msJSON[0].PkgPath + "'>" + "下载任务资源包" + "</td></a></tr>" +
                    "<tr><td colspan='2'><input type='button' id='updtWrkPkgBtn' name='" + msJSON[0].MsID + "' value='上传作业' /></td></a></tr></table>"
                );

                if (msJSON[0].MsStat === "cmpled") $("#content").find("#msMgtDiv").find("#msMgtFrm").find(".qryMsRecsDiv").find("#msDeltTbl").find("#updtWrkPkgBtn").remove();
            }
        }
    });
}

/*显示上传作业的弹窗*/
$("#content").on("click", "#msMgtDiv #msMgtFrm .qryMsRecsDiv #msDeltTbl #updtWrkPkgBtn", function (event) {
    let msID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='upldWorkDiv' name='upldWorkDiv'>" +
        "<form id='upldWorkFrm' name='upldWorkFrm' enctype='multipart/form-data' " +
        "action='../../library/common/upload_work.php' method='post' target='doNotRefresh' onsubmit='return checkWork()'>" +
        "<table id='upldWorkTbl' name='upldWorkTbl'><tr><th colspan='2'><span>上传作业</span></th></tr>" +
        "<tr><td><label>作业文件</label></td><td><input type='file' id='newWork' name='newWork' /></td></tr>" +
        "<tr><td><input type='button' id='cnlUpldWorkBtn' name='" + msID + "' value='取消' /></td>" +
        "<td><input type='submit' id='upldWorkBtn' name='" + msID + "' value='上传' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*检查上传作业的文件*/
function checkWork() {
    let newWork = $("body").find("#upldWorkDiv").find("#upldWorkFrm").find("#upldWorkTbl").find("#newWork").val();

    if (newWork == "") { alert("请选择待上传的作业文件再执行上传操作"); return false; }

    return true;
}

/*取消上传作业*/
$("body").on("click", "#upldWorkDiv #upldWorkFrm #upldWorkTbl #cnlUpldWorkBtn", function (event) {
    let msID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: hidden;");
    $("body").find("#upldWorkDiv").remove();

    queryStdMsDelt(msID);
});