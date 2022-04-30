var achvInfo = null;
var achvLstLimt = 20;
var achvTotPages = null;
var achvCurrPage = null;
var achvPageOptLimt = 5;
var achvIDAray = new Array();
var achvIDIndx = null;

/*查询成就记录*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #qryAchvMenuTbl #qryAchvRecsBtn", function () {
    let searchItem = $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("#qryAchvItem").val();
    let searchType = $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("#qryAchvType").val();

    if (searchItem != "") {
        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvBarTbl").find("#qryAchvAnchor").siblings().remove();
        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find(".qryRecsLstTbl").empty();

        queryAchvResc(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过导航标签查询成就记录*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #qryAchvBarTbl #qryAchvAnchor", function () {
    queryAchvResc(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "AchvTitl");
});

/*实现查询成就记录的函数*/
function queryAchvResc(usrID, usrRole, colgAbrv, mjrAbrv, searchItem, searchType) {
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("#qryAchvItem").val();
    // $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("input").removeAttr("disabled");
    // $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("select").removeAttr("disabled");

    $.ajax({
        url: "../../library/common/query_achvs.php",
        type: "GET",
        async: false,
        data: {
            usrID: usrID, usrRole: usrRole, colgAbrv: colgAbrv,
            mjrAbrv: mjrAbrv, searchItem: searchItem, searchType: searchType
        },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (achvJSON) {
            achvInfo = achvJSON;

            $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvBarTbl").find("#qryAchvAnchor").siblings().remove();

            $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").empty();
            $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").append("<table class='qryRecsLstTbl'></table>");

            $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='achvRecsHead'><th id='checkboxhead' wdith='50px'></th><th>成就ID</th><th>成就名称</th><th>作品格式</th><th>其他</th></tr>"
            );

            if (achvInfo.length === 0) {
                alert("共0条成就记录");

                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (achvInfo.length <= achvLstLimt) {
                achvTotPages = 1;
                achvCurrPage = 1;
            } else {
                achvTotPages = parseInt(achvInfo.length / achvLstLimt);
                if (achvInfo.length % achvLstLimt) achvTotPages++;
                achvCurrPage = 1;
            }
            if (achvInfo.length != 0) {
                printAchvLsts(achvCurrPage);
                printAchvPageOpts(achvCurrPage);
            }
        }
    });
}

/*实现打印每页课程记录的函数*/
function printAchvLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    achvIDAray = new Array();
    achvIDIndx = null;

    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find(".qryRecsLstTbl").find("#achvRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * achvLstLimt;
    endIndx = (currPage * achvLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < achvInfo.length; begnIndx++) {
        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find(".qryRecsLstTbl").append(
            "<tr><td class='checkboxtd'><input type='checkbox' class='achvCheckBox' value='" + achvInfo[begnIndx].AchvID + "' /></td>" +
            "<td>" + achvInfo[begnIndx].AchvID + "</td><td>" + achvInfo[begnIndx].AchvTitl + "</td>" +
            "<td>" + achvInfo[begnIndx].AchvFmt + "</td>" +
            "<td><a href='#' id='" + achvInfo[begnIndx].AchvID + "' class='achvDetlAnchor'>进入详情页</a></td></tr>"
        );
    }
}

/*实现打印页码选项的函数*/
function printAchvPageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (achvTotPages < achvPageOptLimt) {
        begnPage = 1;
        endPage = achvTotPages;
    } else {
        if (currPage < achvPageOptLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % achvPageOptLimt);
            let pageQuot = parseInt(currPage / achvPageOptLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * achvPageOptLimt) + 1) : ((pageQuot * achvPageOptLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * achvPageOptLimt) : (((pageQuot + 1) * achvPageOptLimt)))
        }
    }

    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === achvTotPages) $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#achvRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #achvRecsPageCtlTbl #prevPage", function () {
    if (achvCurrPage != 1) {
        achvCurrPage--;
        printAchvLsts(achvCurrPage);
        printAchvPageOpts(achvCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #achvRecsPageCtlTbl .pageOpt", function (event) {
    achvCurrPage = $(event.target).val();
    printAchvLsts(achvCurrPage);
    printAchvPageOpts(achvCurrPage);
});

/*下一页*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #achvRecsPageCtlTbl #nextPage", function () {
    if (achvCurrPage != achvTotPages) {
        achvCurrPage++;
        printAchvLsts(achvCurrPage);
        printAchvPageOpts(achvCurrPage);
    }
});

/*获取选中的成就ID*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv .qryRecsLstTbl .achvCheckBox", function (event) {
    let currAchvID = $(event.target).val();
    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currAchvIDIndx = achvIDAray.indexOf(currAchvID);
        achvIDAray.splice(currAchvIDIndx, 1);
        achvIDIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        achvIDAray[achvIDIndx++] = currAchvID;
    }
});

/*显示添加新成就的弹窗*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #qryAchvMenuTbl #addRecBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='addAchvRecDiv' class='achvMgtPopup'><form id='addAchvRecFrm' action='../../library/common/add_achv.php' " +
        "target='doNotRefresh' method='post' enctype='multipart/form-data' onsubmit='return checkAchvInfo()'>" +
        "<table id='addAchvRecTbl'>" +
        "<tr><th colspan='2'><span id='addAchvRecTitl'>新增成就</span></th></tr>" +
        "<tr><td><label>成就名称</label></td><td><input type='text' id='achvTitl' name='achvTitl' maxlength='100' /></td></tr>" +
        "<tr><td><label>作品文件</label></td><td><input type='file' id='newAchv' name='newAchv' /></td></tr>" +
        "<tr><td><label>成就描述</label></td><td><textarea id='achvDesc' name='achvDesc' class='textareaPopup'></textarea></td></tr>" +
        "<tr><td><input type='button' id='cnlAddNewRecBtn' class='cnlBtn' value='取消' /></td>" +
        "<td><input type='submit' id='addNewRecBtn' name='addNewRecBtn' value='上传' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*取消新增成就*/
$("body").on("click", "#addAchvRecDiv #addAchvRecFrm #addAchvRecTbl #cnlAddNewRecBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");
    $("body").find("#addAchvRecDiv").remove();

    queryAchvResc(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "AchvTitl");
});

/*新增成就时检查成就名称的完整性*/
$("body").on("focusout", "#addAchvRecDiv #addAchvRecFrm #addAchvRecTbl #achvTitl", function (event) {
    let achvTitl = $(event.target).val();

    if (achvTitl == "") $(event.target).attr("placeholder", "请输入成就名称");
    else $(event.target).removeAttr("placeholder");
});

/*新增成就时检查成就描述的完整性*/
$("body").on("focusout", "#addAchvRecDiv #addAchvRecFrm #addAchvRecTbl #achvDesc", function (event) {
    let achvTitl = $(event.target).val();

    if (achvTitl == "") $(event.target).attr("placeholder", "请输入成就描述");
    else $(event.target).removeAttr("placeholder");
});

/*检查上传文件*/
function checkAchvInfo() {
    let achvTitl = $("body").find("#addAchvRecDiv").find("#addAchvRecFrm").find("#addAchvRecTbl").find("#achvTitl").val();
    let newAchv = $("body").find("#addAchvRecDiv").find("#addAchvRecFrm").find("#addAchvRecTbl").find("#newAchv").val();
    let achvDesc = $("body").find("#addAchvRecDiv").find("#addAchvRecFrm").find("#addAchvRecTbl").find("#achvDesc").val();

    if (achvTitl == "" || newAchv == "" || achvDesc == "") { alert("请完善成就信息再执行上传操作"); return false; }

    return true;
}

/*批量删除成就记录*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm #qryAchvMenuTbl #delRecsBtn", function () {
    if (achvIDAray.length != 0) {
        $.ajax({
            url: "../../library/common/delete_achvs.php",
            type: "POST",
            async: false,
            data: { achvIDAray: achvIDAray, usrRole: usrInfo["UsrRole"] },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功删除" + achvIDAray.length + "条成就记录");
                } else alert(status);
                queryAchvResc(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "AchvTitl");
            }
        });
    } else alert("您选择了0条成就记录，请选择至少一条记录后再执行批量删除操作");
});

/*进入成就详情页面*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv .qryRecsLstTbl .achvDetlAnchor", function (event) {
    let achvID = $(event.target).attr("id");

    queryAchvDetlInfo(achvID);
});

/*实现查询成就详情的函数*/
function queryAchvDetlInfo(achvID) {
    $.ajax({
        url: "../../library/common/query_achvinfo.php",
        type: "GET",
        async: false,
        data: { achvID: achvID, usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (achvJSON) {
            if (achvJSON.length === 0) alert("查询成就详情失败，请联系管理员并反馈问题");
            else {
                achvIDAray = new Array();
                achvIDIndx = null;
                // $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("input").attr("disabled", "disabled");
                // $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvMenuTbl").find("select").attr("disabled", "disabled");
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvBarTbl").find("#qryAchvAnchor").nextAll().remove();
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find("#qryAchvBarTbl").find("#qryAchvAnchor").after("<a class='" + achvID + "' href='#'>成就详情&gt;</a>");
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".recsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").empty();
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").append(
                    "<table id='achvInfoTbl'><tr><td><label>成就名称</label></td><td id='achvFile' rowspan='4' width='65%'></td></tr>" +
                    "<tr><td><input type='text' id='achvTitl' name='achvTitl' value='" + achvJSON[0].AchvTitl + "' class='editable' /></td></tr>" +
                    "<tr><td><label>成就描述</label></td></tr>" +
                    "<tr><td><textarea id='achvDesc' name='achvDesc' class='editable'>" + achvJSON[0].AchvDesc + "</textarea></td></tr>" +
                    "<tr><td><input type='button' id='editAchvInfoBtn' name='editAchvInfoBtn' value='编辑' />" +
                    "<input type='button' id='cnlEditAchvInfoBtn' name='" + achvJSON[0].AchvID + "' value='取消' />" +
                    "<input type='button' id='updtAchvInfoBtn' name='" + achvJSON[0].AchvID + "' value='更新' /></td>" +
                    "<td><input type='button' id='delAchvBtn' name='" + achvJSON[0].AchvID + "' value='删除成就' /></td></tr></table>"
                );

                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("input[type='text']").attr("disabled", "disabled");
                $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("textarea").attr("disabled", "disabled");

                switch (achvJSON[0].AchvFmt) {
                    case "bmp":
                    case "gif":
                    case "jpg":
                    case "png":
                        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#achvFile").
                            append("<img src='" + achvJSON[0].AchvPath + "' />"); break;
                    case "mp3":
                    case "m4a":
                        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#achvFile").
                            append("<audio controls><source src='" + achvJSON[0].AchvPath + "' type='audio/mpeg'>" +
                                "抱歉！您的浏览器不支持audio标签。</audio>"); break;
                    case "mp4":
                    case "mkv":
                        $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#achvFile").
                            append("<video controls><source src='" + achvJSON[0].AchvPath + "' type='video/mp4'>" +
                                "抱歉！您的浏览器不支持video标签。</video>"); break;
                }
            }
        }
    });
}

/*编辑成就信息*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #editAchvInfoBtn", function () {
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("input[type='text']").removeAttr("disabled");
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("textarea").removeAttr("disabled");
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#cnlEditAchvInfoBtn").attr("style", "visibility: visible");
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#updtAchvInfoBtn").attr("style", "visibility: visible");
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#editAchvInfoBtn").remove();
    $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#delAchvBtn").remove();
});


/*编辑时检查成就名称完整性*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #achvTitl", function (event) {
    let achvTitl = $(event.target).val();

    if (achvTitl != "") $(event.target).attr("placeholder", "请输入成就名称");
    else $(event.target).removeAttr("placeholder");
});

/*编辑时检查成就描述完整性*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #achvDesc", function (event) {
    let achvDesc = $(event.target).val();

    if (achvDesc != "") $(event.target).attr("placeholder", "请输入成就名称");
    else $(event.target).removeAttr("placeholder");
});

/*取消更新成就信息*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #cnlEditAchvInfoBtn", function (event) {
    let achvID = $(event.target).attr("name");

    queryAchvDetlInfo(achvID);
});

/*更新成就信息*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #updtAchvInfoBtn", function (event) {
    let achvID = $(event.target).attr("name");
    let achvTitl = $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#achvTitl").val();
    let achvDesc = $("#content").find("#achvMgtDiv").find("#achvMgtFrm").find(".qryAchvRecsDiv").find("#achvInfoTbl").find("#achvDesc").val();

    if (achvTitl != "" && achvDesc != "") {
        $.ajax({
            url: "../../library/common/update_achv.php",
            type: "POST",
            async: false,
            data: { achvID: achvID, achvTitl: achvTitl, achvDesc: achvDesc, usrRole: usrInfo["UsrRole"] },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功更新成就信息");
                    queryAchvDetlInfo(achvID);
                } else alert(status);
            }
        });
    }
});

/*删除成就*/
$("#content").on("click", "#achvMgtDiv #achvMgtFrm .qryAchvRecsDiv #achvInfoTbl #delAchvBtn", function (event) {
    let achvID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/delete_achv.php",
        type: "POST",
        async: false,
        data: { achvID: achvID, usrRole: usrInfo["UsrRole"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") {
                alert("成功删除成就记录");
                queryAchvResc(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "AchvTitl");
            } else alert(status);
        }
    });
});