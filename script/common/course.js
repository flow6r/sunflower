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

            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").empty();
            $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").append("<table class='qryRecsLstTbl'></table>");

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
    begnIndx = (currPage - 1) * crsesLstLimt;
    endIndx = (currPage * crsesLstLimt) - 1;

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
        printCrseLsts(crsesCurrPage);
        printCrsePageOpts(crsesCurrPage);
    }
});

/*页码跳转*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #crseRecsPageCtlTbl .pageOpt", function (event) {
    crsesCurrPage = $(event.target).val();
    printCrseLsts(crsesCurrPage);
    printCrsePageOpts(crsesCurrPage);
});

/*下一页*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #crseRecsPageCtlTbl #nextPage", function () {
    if (crsesCurrPage != crsesTotPages) {
        crsesCurrPage++;
        printCrseLsts(crsesCurrPage);
        printCrsePageOpts(crsesCurrPage);
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

    if (searchItem === "") {
        searchItem = "";
        searchType = "CrseName";
    }

    queryCrses(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], searchItem, searchType);
}

/*进入课程详情页*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv .crseDetlAnchor", function (event) {
    let crseID = $(event.target).attr("id");

    queryCurrCrseInfo(crseID);
});

/*实现查询课程详情的函数*/
function queryCurrCrseInfo(crseID) {
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
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("input").attr("disabled", "disabled");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("select").attr("disabled", "disabled");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#qryCrseAnchor").siblings().remove();
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#qryCrseAnchor").after("<a id='crseInfoAnchor' class='" + crseID + "' href='#'>课程详情&gt;</a>");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".recsPageCtlTbl").attr("style", "visibility: hidden;");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").empty();
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").append(
                    "<table id='currCrseInfoTbl'><tr><td rowspan='4'><img src='' /></td>" +
                    "<td><label>课程名称</label></td><td><input type='text' id='crseName' name='crseName' maxlength='20' disabled='disabled' /></td>" +
                    "</tr><tr><td><label>讲师</label></td><td><input type='text' id='usrName' name='usrName' maxlength='20' disabled='disabled' /></td>" +
                    "</tr><tr><td><label>课程描述</label></td><td><textarea id='crseDesc' placeholder='' disabled='disabled'></textarea></td>" +
                    "</tr><tr><td colspan='2'><a id='qryStds' class='" + crseJSON[0].CrseID + "' href='#'>选课学生</a>&nbsp;<a id='qryMss' class='" + crseJSON[0].CrseID + "' href='#'>课程作业</a>&nbsp;" +
                    "<a id='addMss' class='" + crseJSON[0].CrseID + "' href='#'>布置作业</a></td></tr><tr><td><input type='button' id='updtCover' name='" + crseJSON[0].CrseID + "' value='更新封面' /></td>" +
                    "<td><input type='button' id='editCrseInfoBtn' name='editCrseInfoBtn' value='编辑' /></td>" +
                    "<td colspan='2'><input type='button' id='cnlEditCrseInfoBtn' name='" + crseJSON[0].CrseID + "' value='取消' />" +
                    "<input type='button' id='updtCrseInfoBtn' name='" + crseJSON[0].CrseID + "' value='更新' /></td></tr></table>"
                );

                if (usrInfo["UsrRole"] === "std") {
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#updtCover").attr("id", "regCrseBtn");
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#regCrseBtn").attr("value", "立即报名");
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#addMss").remove();
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#editCrseInfoBtn").remove();
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#cnlEditCrseInfoBtn").remove();
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#updtCrseInfoBtn").remove();
                }
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("img").attr(
                    "src", (crseJSON[0].CoverPath === null ? "../image/crsefront/temp/meerkat.jpg" : crseJSON[0].CoverPath));
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").attr("placeholder", crseJSON[0].CrseName);
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").attr("placeholder", crseJSON[0].UsrName);
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").attr("placeholder", crseJSON[0].CrseDesc);
            }
        }
    });
}

/*通过导航栏查询课程详情*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #qryCrseBarTbl #crseInfoAnchor", function (event) {
    let crseID = $(event.target).attr("class");

    queryCurrCrseInfo(crseID);
});

/*编辑课程信息*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #editCrseInfoBtn", function () {
    let crseName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").attr("placeholder");
    let usrName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").attr("placeholder");
    let crseDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").attr("placeholder");

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").removeAttr("placeholder").removeAttr("disabled").val(crseName);
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").removeAttr("placeholder").removeAttr("disabled").val(usrName);
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").removeAttr("placeholder").removeAttr("disabled").val(crseDesc);

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#editCrseInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#cnlEditCrseInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#updtCrseInfoBtn").attr("style", "visibility: visible;");
});

/*显示更新课程封面的弹窗*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #updtCover", function (event) {
    let crseID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updtCoverDiv' name='updtCoverDiv'>" +
        "<form id='updtCoverFrm' name='updtCoverFrm' enctype='multipart/form-data' " +
        "action='../../library/common/update_cover.php' method='post' target='doNotRefresh' onsubmit='return checkCover()'>" +
        "<table id='updtCoverTbl' name='updtCoverTbl'><tr><th colspan='2'><span>上传封面</span></th></tr>" +
        "<tr><td><label>封面文件</label></td><td><input type='file' id='newCover' name='newCover' /></td></tr>" +
        "<tr><td><input type='button' id='cnlUpdtCoverBtn' name='" + crseID + "' value='取消' /></td>" +
        "<td><input type='submit' id='updtCoverBtn' name='" + crseID + "' value='上传' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*检查封面图片文件的函数*/
function checkCover() {
    let newCover = $("body").find("#updtCoverDiv").find("#updtCoverFrm").find("#updtCoverTbl").find("#newCover").val();

    if (newCover == "") { alert("请选择待上传的封面图片文件后再执行上传操作"); return false; }

    return true;
}

/*实现取消更新封面的函数*/
$("body").on("click", "#updtCoverDiv #updtCoverFrm #updtCoverTbl #cnlUpdtCoverBtn", function (event) {
    let crseID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: hidden;");

    $("body").find("#updtCoverDiv").remove();

    queryCurrCrseInfo(crseID);
});

/*取消更新课程信息*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #cnlEditCrseInfoBtn", function (event) {
    let crseID = $(event.target).attr("name");

    queryCurrCrseInfo(crseID);
});

/*更新课程信息时检查课程名称完整性*/
$("#content").on("focusout", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #crseName", function () {
    let crseName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").val();

    if (crseName == "") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").attr("placeholder", "请输入课程名称");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").removeAttr("placeholder");
});

/*更新课程信息时检查讲师姓名完整性*/
$("#content").on("focusout", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #usrName", function () {
    let usrName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").val();

    if (usrName == "") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").attr("placeholder", "请输入教师姓名");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").removeAttr("placeholder");
});

/*更新课程信息时检查讲师描述完整性*/
$("#content").on("focusout", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #crseDesc", function () {
    let crseDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").val();

    if (crseDesc == "") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").attr("placeholder", "请输入课程描述");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").removeAttr("placeholder");
});

/*更新课程信息*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #updtCrseInfoBtn", function (event) {
    let crseName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseName").val();
    let usrName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#usrName").val();
    let crseDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").find("#crseDesc").val();
    let crseID = $(event.target).attr("name");

    if (crseName != "" && usrName != "" && crseDesc != "") {
        $.ajax({
            url: "../../library/common/update_crse.php",
            type: "POST",
            async: false,
            data: { crseName: crseName, usrName: usrName, crseDesc: crseDesc, usrRole: usrInfo["UsrRole"], colgAbrv: usrInfo["ColgAbrv"] },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功更新课程信息");
                    queryCurrCrseInfo(crseID);
                } else alert(status);
            }
        });
    } else alert("请完善待更新的课程信息后再执行更新操作");
});

/*报名课程*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #regCrseBtn", function (event) {
    let crseID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/course_reg.php",
        type: "POST",
        async: false,
        data: { crseID: crseID, usrID: usrInfo["UsrID"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") { alert("成功报名课程"); queryCurrCrseInfo(crseID); }
            else alert(status);
        }
    });
});

/*查询选课学生*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #qryStds", function (event) {
    let crseID = $(event.target).attr("class");

    let stdRecsTblWidth = $("#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv").innerWidth();
    let stdRecsTblHeight = $("#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv").innerHeight();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseInfoAnchor").nextAll().remove();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseInfoAnchor").after("<a href='#'>选课学生&gt;</a>");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#currCrseInfoTbl").remove();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").append(
        "<div id='crseStdRecsDiv'><table id='crseStdRecsTbl'>" +
        "<tr><th>学号</th><th>姓名</th><th>性别</th><th>电子邮箱</th></tr></table></div>"
    );
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseStdRecsDiv").attr("style", "width: " + stdRecsTblWidth + "px;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseStdRecsDiv").attr("style", "height: " + stdRecsTblHeight + "px;");

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
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseStdRecsDiv").find("#crseStdRecsTbl").append(
                        "<tr><td>" + crseStdsJSON[indx].UsrID + "</td><td>" + crseStdsJSON[indx].UsrName + "</td>" +
                        "<td>" + (crseStdsJSON[indx].UsrGen === "male" ? "男" : "女") +
                        "</td><td><a href='mailto:" + crseStdsJSON[indx].UsrEmail + "'>" + crseStdsJSON[indx].UsrEmail + "</a></td></tr>"
                    );
            }
        }
    });
});

/*添加课程任务*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #addMss", function (event) {
    let crseID = $(event.target).attr("class");

    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='addMSRecDiv'><form id='addMSRecFrm' action='../../library/common/add_ms.php' " +
        "target='doNotRefresh' method='post' enctype='multipart/form-data' onsubmit='return checkMSPkg()'>" +
        "<table id='addMSRecTbl'>" +
        "<tr><th colspan='2'><span id='addMSRecTitl'>新增课程任务</span></th></tr>" +
        "<tr><td><label>任务名称</label></td><td><input type='text' id='msName' name='msName' maxlength='100' /></td></tr>" +
        "<tr><td><label>任务描述</label></td><td><textarea id='msDesc' name='msDesc' class='msDesc'></textarea></td></tr>" +
        "<tr><td><label>.zip资源包</label></td><td><input type='file' id='newMSPkg' name='newMSPkg' /></td></tr>" +
        "<tr><td><input type='button' id='cnlAddNewMSBtn' name='" + crseID + "' value='取消' /></td>" +
        "<td><input type='submit' id='addNewRecBtn' name='addNewRecBtn' value='新增' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*上传资源时检查任务名称完整性*/
$("body").on("focusout", "#addMSRecDiv #addMSRecFrm #addMSRecTbl #msName", function () {
    let msName = $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msName").val();

    if (msName == "") $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msName").attr("placeholder", "请输入任务名称");
    else $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msName").removeAttr("placeholder");
});

/*上传资源时检查任务描述完整性*/
$("body").on("focusout", "#addMSRecDiv #addMSRecFrm #addMSRecTbl #msDesc", function () {
    let msDesc = $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msDesc").val();

    if (msDesc == "") $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msDesc").attr("placeholder", "请输入任务描述");
    else $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msDesc").removeAttr("placeholder");
});

/*检查上传文件的函数*/
function checkMSPkg() {
    let msName = $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msName").val();
    let msDesc = $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#msDesc").val();
    let newMSPkg = $("body").find("#addMSRecDiv").find("#addMSRecFrm").find("#addMSRecTbl").find("#newMSPkg").val();

    if (msName == "" || msDesc == "" || newMSPkg == "") { alert("请选择待上传的资源包后再执行上传操作"); return false; }

    return true;
}

/*取消上传任务资源*/
$("body").on("click", "#addMSRecDiv #addMSRecFrm #addMSRecTbl #cnlAddNewMSBtn", function (event) {
    let crseID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: hidden;");
    $("body").find("#addMSRecDiv").remove();

    queryCurrCrseInfo(crseID);
});

/*查询课程任务*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #currCrseInfoTbl #qryMss", function (event) {
    let crseID = $(event.target).attr("class");

    queryCrseMs(crseID);
});

/*实现查询课程任务记录的函数*/
function queryCrseMs(crseID) {
    let msRecsTblWidth = $("#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv").innerWidth();
    let msRecsTblHeight = $("#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv").innerHeight();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseInfoAnchor").nextAll().remove();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseInfoAnchor").after("<a id='crseMsAnchor' class='" + crseID + "' href='#'>课程任务&gt;</a>");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").empty();
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").append(
        "<div id='crseMsRecsDiv'><table id='crseMsRecsTbl'>" +
        "<tr><th>任务ID</th><th>任务名称</th><th>创建者</th><th class='otherOpts'>其他操作</th></tr></table></div>"
    );
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseMsRecsDiv").attr("style", "width: " + msRecsTblWidth + "px;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseMsRecsDiv").attr("style", "height: " + msRecsTblHeight + "px;");

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
                    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#crseMsRecsDiv").find("#crseMsRecsTbl").append(
                        "<tr><td>" + crseMsJSON[indx].MsID + "</td><td>" + crseMsJSON[indx].MsName + "</td>" +
                        "<td>" + crseMsJSON[indx].UsrName + "</td><td><a class='" + crseMsJSON[indx].MsID + "' href='#'>" + "详情" + "</a></td></tr>"
                    );
            }
        }
    });
}

/*通过导航栏实现查询课程任务记录*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #qryCrseBarTbl #crseMsAnchor", function (event) {
    let crseID = $(event.target).attr("class");

    queryCrseMs(crseID);
});

/*显示课程任务详情*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #crseMsRecsDiv #crseMsRecsTbl a", function (event) {
    let msID = $(event.target).attr("class");

    queryMissionDelt(msID);
});

/*实现查询任务详情的函数*/
function queryMissionDelt(msID) {
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
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseMsAnchor").nextAll().remove();
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseMsAnchor").after("<a id='msDeltAnchor' class='" + msID + "' href='#'>任务详情&gt;</a>");
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").empty();
                $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").append(
                    "<table id='msDeltTbl'>" +
                    "<tr><td><label>任务名称</label></td><td><input type='text' id='msName' name='msName' disabled='disabled' placeholder='" + msJSON[0].MsName + "' maxlength='100' /></td></tr>" +
                    "<tr><td><label>任务描述</label></td><td><textarea id='msDesc' name='msDesc' placeholder='" + msJSON[0].MsDesc + "' disabled='disabled'></textarea></td></tr>" +
                    "<tr><td colspan='2' style='text-align: center;'><a href='" + msJSON[0].PkgPath + "'>" + "下载任务资源包" + "</td></a></tr>" +
                    "<tr><td><input type='button' id='editMsInfoBtn' name='editMsInfoBtn' value='编辑' /></td><td><input type='button' id='cnlEditMsInfoBtn' name='" + msJSON[0].MsID + "' value='取消'/>" +
                    "<input type='button' id='updtMsInfoBtn' name='" + msJSON[0].MsID + "' value='更新' /><input type='button' id='delMsBtn' name='" + msJSON[0].MsID + "' value='删除任务' /></td></tr>" +
                    "</table>"
                );

                if (usrInfo["UsrRole"] === "std")     $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("input[type='button']").remove();
            }
        }
    });
}

/*通过导航栏查询课程任务详情*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm #qryCrseBarTbl #msDeltAnchor", function (event) {
    let msID = $(event.target).attr("class");

    queryMissionDelt(msID);
});

/*更新课程任务详情*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #editMsInfoBtn", function () {
    let msName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").attr("placeholder");
    let msDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").attr("placeholder");

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").removeAttr("placeholder").removeAttr("disabled").val(msName);
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").removeAttr("placeholder").removeAttr("disabled").val(msDesc);
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#editMsInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#delMsBtn").attr("style", "visibility: hidden;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#cnlEditMsInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#updtMsInfoBtn").attr("style", "visibility: visible;");
});

/*更新课程任务详情时检查任务名称完整性*/
$("#content").on("focusout", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #msName", function () {
    let msName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").val();

    if (msName == "") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").attr("placeholder", "请输入任务名称");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").removeAttr("placeholder");
});

/*更新课程任务详情时检查任务描述完整性*/
$("#content").on("focusout", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #msDesc", function () {
    let msDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").val();

    if (msDesc == "") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").attr("placeholder", "请输入任务名称");
    else $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").removeAttr("placeholder");
});

/*实现更新课程任务详情的函数*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #updtMsInfoBtn", function (event) {
    let msName = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msName").val();
    let msDesc = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find(".qryCrseRecsDiv").find("#msDeltTbl").find("#msDesc").val();
    let msID = $(event.target).attr("name");

    if (msName == "" || msDesc == "") alert("请完善任务信息后再执行更新操作");
    else $.ajax({
        url: "../../library/common/update_msinfo.php",
        type: "POST",
        async: false,
        data: { msID: msID, msName: msName, msDesc: msDesc, usrRole: usrInfo["UsrRole"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") { alert("成功更新任务详情"); queryMissionDelt(msID); }
            else alert(status);
        }
    });
});

/*取消更新课程任务详情*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #cnlEditMsInfoBtn", function (event) {
    let msID = $(event.target).attr("name");

    queryMissionDelt(msID);
});

/*删除课程任务*/
$("#content").on("click", "#crseMgtDiv #crseMgtFrm .qryCrseRecsDiv #msDeltTbl #delMsBtn", function (event) {
    let msID = $(event.target).attr("name");
    let crseID = $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseBarTbl").find("#crseMsAnchor").attr("class");

    $.ajax({
        url: "../../library/common/delete_ms.php",
        type: "POST",
        async: false,
        data: { msID: msID, usrRole: usrInfo["UsrRole"] },
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") { alert("成功删除课程任务"); queryCrseMs(crseID); }
            else alert(status);
        }
    });
});