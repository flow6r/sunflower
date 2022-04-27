var crsesInfo = null;
var crsesLstLimt = 20;
var crsesTotPages = null;
var crsesCurrPage = null;
var crsePageOptLimt = 5;
var crseIDAray = new Array();
var crseIDIndx = null;

/*查询课程*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #qryCrseMenuTbl #qryCrseRecsBtn", function () {
    let searchItem = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseItem").val();
    let searchType = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseType").val();

    if (searchItem != "") {
        $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#qryCrseAnchor").siblings().remove();
        $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".qryRecsLstTbl").empty();

        queryCrses(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], searchItem, searchType);
    } else alert("请输入待查询的关键词");
});

/*通过导航标签查询课程记录*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #qryCrseBarTbl #qryCrseAnchor", function () {
    queryCrses(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "CrseName");
});

/*实现查询课程记录的函数*/
function queryCrses(usrID, usrRole, colgAbrv, mjrAbrv, searchItem, searchType) {
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseItem").val();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("input").removeAttr("disabled");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("select").removeAttr("disabled");

    $.ajax({
        url: "../../library/common/query_crses.php",
        type: "GET",
        async: false,
        data: { usrID: usrID, usrRole: usrRole, colgAbrv: colgAbrv, mjrAbrv: mjrAbrv, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (crsesJSON) {
            crsesInfo = crsesJSON;

            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#qryCrseAnchor").siblings().remove();

            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".currCrseInfoTbl").empty();
            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".currCrseInfoTbl").attr("class", "qryRecsLstTbl")

            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".qryRecsLstTbl").append(
                "<tr id='crseRecsHead'><th width='50px'></th><th>课程ID</th><th>课程名称</th><th>讲师姓名</th><th>其他</th></tr>"
            );

            if (crsesInfo.length === 0) {
                alert("共0条课程记录");

                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
            } else if (crsesInfo.length <= crsesLstLimt) {
                crsesTotPages = 1;
                crsesCurrPage = 1;
            } else {
                crsesTotPages = parseInt(crsesInfo.length / crsesLstLimt);
                if (crsesInfo.length % crsesLstLimt) crsesTotPages++;
                crsesCurrPage = 1;
            }
            printCrseLsts(crsesCurrPage);
            printCrsePageOpts(crsesCurrPage);
        }
    });
}

/*实现打印每页课程记录的函数*/
function printCrseLsts(currPage) {
    let begnIndx = null;
    let endIndx = null;
    crseIDAray = new Array();
    crseIDIndx = null;

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".qryRecsLstTbl").find("#crseRecsHead").siblings().remove();
    begnIndx = (currPage - 1) * usrsLstLimt;
    endIndx = (currPage * usrsLstLimt) - 1;

    for (; begnIndx <= endIndx && begnIndx < crsesInfo.length; begnIndx++) {
        $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".qryRecsLstTbl").append(
            "<tr><td><input type='checkbox' class='crseCheckBox' value='" + crsesInfo[begnIndx].CrseID + "' /></td>" +
            "<td>" + crsesInfo[begnIndx].CrseID + "</td><td>" + crsesInfo[begnIndx].CrseName + "</td>" +
            "<td>" + crsesInfo[begnIndx].UsrName + "</td>" +
            "<td><a href='#' id='" + crsesInfo[begnIndx].CrseID + "' class='crseDetlAnchor'>进入详情页</a></td></tr>"
        );
    }
}

/*实现打印页码选项的函数*/
function printCrsePageOpts(currPage) {
    let begnPage = null;
    let endPage = null;

    if (crsesTotPages < crsePageOptLimt) {
        begnPage = 1;
        endPage = crsesTotPages;
    } else {
        if (currPage < crsePageOptLimt) {
            begnPage = 1;
            endPage = 5;
        } else {
            let pageMod = parseInt(currPage % crsePageOptLimt);
            let pageQuot = parseInt(currPage / crsePageOptLimt);
            begnPage = (pageMod === 0 ? (((pageQuot - 1) * crsePageOptLimt) + 1) : ((pageQuot * crsePageOptLimt) + 1))
            endPage = (pageMod === 0 ? (pageQuot * crsePageOptLimt) : (((pageQuot + 1) * crsePageOptLimt)))
        }
    }

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").attr("style", "visibility: visible;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#pageOpts").empty();

    for (; begnPage <= endPage; begnPage++) {
        $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#pageOpts").append(
            "<input type='button' class='pageOpt' value='" + begnPage + "'>"
        );
    }

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#pageOpts").find(".currPageOpt").attr("class", "pageOpt");

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#pageOpts").find("input[type='button'][value='" + currPage + "']").attr("class", "currPageOpt");

    if (currPage === 1) $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#prevPage").removeAttr("disabled");

    if (currPage === crsesTotPages) $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#crseRecsPageCtlTbl").find("#nextPage").removeAttr("disabled");
}

/*上一页*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #crseRecsPageCtlTbl #prevPage", function () {
    if (crsesCurrPage != 1) {
        crsesCurrPage--;
        printUsrLsts(crsesCurrPage);
        printPageOpts(crsesCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #crseRecsPageCtlTbl .pageOpt", function (event) {
    crsesCurrPage = $(event.target).val();
    printUsrLsts(crsesCurrPage);
    printPageOpts(crsesCurrPage);
});

/*下一页*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #crseRecsPageCtlTbl #nextPage", function () {
    if (crsesCurrPage != usrsTotPages) {
        crsesCurrPage++;
        printUsrLsts(crsesCurrPage);
        printPageOpts(crsesCurrPage);
    }
});

/*获取选中的课程ID*/
$("#content").on("click", "#crseMgtDiv .qryCrseRecsDiv .qryRecsLstTbl .crseCheckBox", function (event) {
    let currCrseID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currCrseIDIndx = crseIDAray.indexOf(currCrseID);
        crseIDAray.splice(currCrseIDIndx, 1);
        crseIDIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        crseIDAray[crseIDIndx++] = currCrseID;
    }
});

/*显示添加课程的弹窗*/
$("#content").on("click", "#crseMgtDiv #qryCrseMenuTbl #addRecBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='addCrseRecDiv' class='crseMgtPopup'><form id='addCrseRecFrm' action='../../library/common/add_crse.php' " +
        "target='doNotRefresh' method='post' enctype='multipart/form-data' onsubmit='return checkCrseInfo()'>" +
        "<table id='addCrseRecTbl'>" +
        "<tr><th colspan='2'><span id='addCrseRecTitl'>新增课程记录</span></th></tr>" +
        "<tr><td><label>课程名称</label></td><td><input type='text' id='crseName' name='crseName' maxlength='20' /></td></tr>" +
        "<tr><td><label>课程封面</label></td><td><input type='file' id='crseFrntImg' name='crseFrntImg' /></td></tr>" +
        "<tr><td><label>课程描述</label></td><td><textarea id='crseDesc' name='crseDesc' class='textareaPopup'></textarea></td></tr>" +
        "<tr><td><input type='button' class='cnlBtn' value='取消' /></td>" +
        "<td><input type='submit' id='addNewRecBtn' name='addNewRecBtn' value='新增' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*检查表单数据的函数*/
function checkCrseInfo() {
    let crseName = $("body").find("#addCrseRecDiv").find("#addCrseRecFrm").find("#addCrseRecTbl").find("#crseName").val();
    let crseFrntImg = $("body").find("#addCrseRecDiv").find("#addCrseRecFrm").find("#addCrseRecTbl").find("#crseFrntImg").val();
    let crseDesc = $("body").find("#addCrseRecDiv").find("#addCrseRecFrm").find("#addCrseRecTbl").find("#crseDesc").val();

    if (crseName === "" || crseFrntImg === "" || crseDesc === "") { alert("请完善课程信息后再添加课程记录"); return false; }

    return true;
}

/*显示批量添加课程的弹窗*/
$("#content").on("click", "#crseMgtDiv #qryCrseMenuTbl #impRecsBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='impCrseRecsDiv' name='impCrseRecsDiv' class='crseMgtPopup'>" +
        "<form id='impCrseRecsFrm' name='impCrseRecsFrm' enctype='multipart/form-data' " +
        "action='../../library/common/import_crses.php' method='post' target='doNotRefresh' onsubmit='return checkCrsesFile()'>" +
        "<table id='impCrseRecsTbl' name='impCrseRecsTbl'><tr><th colspan='2'><span>批量导入课程记录</span></th></tr>" +
        "<tr><th colspan='2'><a href='http://localhost/data/tmpl/CrseInfoTmpl.xlsx'>下载模板文件</a></th></tr>" +
        "<tr><td><label>课程信息文件</label></td><td><input type='file' id='crseInfoFile' name='crseInfoFile' /></td></tr>" +
        "<tr><td><input type='button' class='cnlBtn' value='取消' /></td>" +
        "<td><input type='submit' name='' class='impNewRecsBtn' value='导入' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});


/*实现检查模板文件的函数*/
function checkCrsesFile() {
    let crseInfoFile = $("body").find("#impCrseRecsDiv").find("#impCrseRecsFrm").find("#impCrseRecsTbl").find("#crseInfoFile").val();

    if (crseInfoFile == "") { alert("请选择待导入的课程记录文件后再执行导入操作"); return false; }

    return true;
}


/*批量删除课程记录*/
$("#content").on("click", "#crseMgtDiv #qryCrseMenuTbl #delRecsBtn", function () {
    if (crseIDAray.length != 0) {
        $.ajax({
            url: "../../library/common/delete_crses.php",
            type: "POST",
            async: false,
            data: { usrRole: usrInfo["UsrRole"], crseIDAray: crseIDAray },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") alert("成功删除" + crseIDAray.length + "条课程记录");
                else alert(status);

                ReQueryCrses();
            }
        });
    } else alert("您选择了0条课程记录，请选择至少一条记录后再执行批量删除操作");
});

/*关闭弹窗*/
$("body").on("click", ".crseMgtPopup .cnlBtn", function () {
    ReQueryCrses();
});

/*实现重新查询课程记录的函数*/
function ReQueryCrses() {
    $("#mask").attr("style", "visibility: hidden;");

    $("body").find(".crseMgtPopup").remove();
    $("body").find(".crseMgtPopupTips").remove();

    let searchItem = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseItem").val();
    let searchType = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseType").val();

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#qryCrseAnchor").siblings().remove();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find(".qryRecsLstTbl").empty();

    if (searchItem === "") {
        searchItem = "";
        searchType = "CrseName";
    }

    queryCrses(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], searchItem, searchType);
}