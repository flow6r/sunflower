var usrInfo = null;
var trgtRole = null;

/*获取登录的用户信息*/
$(document).ready(function () {
    $("#content").empty();
    obtainUsrInfo();
    // $("#content").append("<h1 style='color: #2c974b;'>学生电子档案袋系统</h1>");
});

/*实现从会话中获取用户信息的函数*/
function obtainUsrInfo() {
    $.ajax({
        url: "../../library/session/check_sessn.php",
        type: "GET",
        async: false,
        dataType: "json",
        error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
        success: function (usrInfoJSON) {
            if (usrInfoJSON["error"] === "启动会话时发生错误，请联系管理员并反馈问题")
                window.location.href = "../../index.html";
            else {
                usrInfo = usrInfoJSON;
                switch (usrInfo["UsrRole"]) {
                    case "std": addStdOpt(); break;
                    case "tch": addTchOpt(); break;
                    case "admin": addAdminOpt(); break;
                }
            }
        }
    });
}

/*完善学生用户导航栏*/
function addStdOpt() {
    $("#nav").find("#usrInfo").after("<li id='crseQry' name='crseQry'><label><span>课程查询</span><a href='#'></a></label></li>");
}

/*完善教师用户导航栏*/
function addTchOpt() {
    $("#nav").find("#workQry").remove();
    $("#nav").find("#usrInfo").after(
        "<li id='stdMgt' name='stdMgt'><label><span>学生管理</span><a href='#'></a></label></li>"
    );
    $("#nav").find("#schedMgt").find("label").find("span").empty().append("课程管理");
    $("#nav").find("#schedMgt").attr("id", "crseMgt").attr("name", "crseMgt");
    $("#nav").find("#grpMgt").find("label").find("span").empty().append("小组管理");
    $("#nav").find("#achvMgt").find("label").find("span").empty().append("成就管理");
}

/*完善管理员用户导航栏*/
function addAdminOpt() {
    $("#nav").find("#workQry").remove();
    $("#nav").find("#usrInfo").after(
        "<li id='usrMgt' name='usrMgt'><label><span>用户管理</span><a href='#'></a></label><ul id='usrMgtSubNav' name='usrMgtSubNav'>" +
        "<li id='stdMgt' name='stdMgt'><label><span style='float: right;'>学生用户</span><a href='#'></a></label></li>" +
        "<li id='tchMgt' name='tchMgt'><label><span style='float: right;'>教师用户</span><a href='#'></a></label></li></ul></li>"
    );
    $("#nav").find("#schedMgt").find("label").find("span").empty().append("课程管理");
    $("#nav").find("#schedMgt").attr("id", "crseMgt").attr("name", "crseMgt");
    $("#nav").find("#grpMgt").find("label").find("span").empty().append("小组管理");
    $("#nav").find("#achvMgt").find("label").find("span").empty().append("成就管理");
}

//二级栏目收缩
$(".usrNav").on("click", "label", function () {
    let elemHight = $(this).parent('li').css('max-height');
    if (elemHight == '1500px') {
        $(this).parent('li').animate({ 'max-height': '40px' });
    } else {
        $(this).parent('li').animate({ 'max-height': '1500px' });
    }
});

/*基本信息*/
$(".usrNav").on("click", "#basInfo", function () {
    $("#content").empty();
    $("#content").append(
        "<div id='basInfoDiv'><form id='basInfoFrm' name='basInfoFrm'><table id='basInfoTbl'>" +
        "<tr><td rowspan='6'><img src='' /></td>" +
        "<td><label>ID</label></td><td><input type='text' id='usrID' name='usrID' disabled='disabled' maxlength='15' /></td></tr>" +
        "<tr><td><label>姓名</label></td><td><input type='text' id='usrName' name='usrName' disabled='disabled' maxlength='10' /></td></tr>" +
        "<tr><td><label>性别</label></td><td><select id='usrGen' name='usrGen' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='usrAdms' name='usrAdms' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>隶属学院</label></td><td><select id='colgAbrv' name='colgAbrv' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='mjrAbrv' name='mjrAbrv' disabled='disabled'></select></td></tr>" +
        "<tr><td><input type='button' id='updtAvatar' name='updtAvatar' value='更新头像' /></td>" +
        "<td><input type='button' id='editBasInfoBtn' name='editBasInfoBtn' value='编辑'/></td>" +
        "<td><input type='button' id='cnlEditInfoBtn' name='cnlEditInfoBtn' value='取消'/>" +
        "<input type='button' id='updtBasInfoBtn' name='updtBasInfoBtn' value='更新'/></td></tr></table></form></div>"
    );

    $("#content").find("#basInfoDiv").find("img").attr("src", (usrInfo["AvatarPath"] == null ? "../image/avatar/temp/flower.jpg" : usrInfo["AvatarPath"]));
    $("#content").find("#basInfoDiv").find("#usrID").attr("placeholder", usrInfo["UsrID"]);
    $("#content").find("#basInfoDiv").find("#usrName").attr("placeholder", usrInfo["UsrName"]);
    $("#content").find("#basInfoDiv").find("#usrGen").append("<option value='male'>男</option><option value='female'>女</option>");
    $("#content").find("#basInfoDiv").find("#usrGen").find("option[value='" + usrInfo["UsrGen"] + "']").attr("selected", "selected");
    if (usrInfo["UsrAdms"] != null) $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='" + usrInfo["UsrAdms"] + "'>" + usrInfo["UsrAdms"] + "</option>");
    else $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='null'>暂无</option>");

    $.ajax({
        url: "../../library/common/query_colg.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (colgJSON) {
            for (let indx = 0; indx < colgJSON.length; indx++) {
                $("#content").find("#basInfoDiv").find("#colgAbrv").append(
                    "<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>"
                );
            }
            $("#content").find("#basInfoDiv").find("#colgAbrv").find("option[value='" + usrInfo["ColgAbrv"] + "']").attr("selected", "selected");
            if (usrInfo["MjrAbrv"] != null) {
                $.ajax({
                    url: "../../library/common/query_mjr.php",
                    type: "GET",
                    async: false,
                    data: { usrRole: usrInfo["UsrRole"], colgAbrv: usrInfo["ColgAbrv"] },
                    dataType: "json",
                    error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                    success: function (mjrJSON) {
                        for (let indx = 0; indx < mjrJSON.length; indx++) {
                            $("#content").find("#basInfoDiv").find("#mjrAbrv").append(
                                "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                            );
                        }
                        $("#content").find("#basInfoDiv").find("#mjrAbrv").find("option[value='" + usrInfo["MjrAbrv"] + "']").attr("selected", "selected");
                    }
                });
            } else $("#content").find("#basInfoDiv").find("#mjrAbrv").append("<option value='null'>暂无</option>");
        }
    });
});

/*安全设置*/
$(".usrNav").on("click", "#secInfo", function () {
    $("#content").empty();
    $("#content").append(
        "<div id='secInfoDiv'><form id='secInfoFrm' name='secInfoFrm'><table id='secInfoTbl'>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='email' id='usrEmail' name='usrEmail' disabled='disabled' maxlength='100' /></td>" +
        "<td><input type='button' id='updtEmailBtn' name='updtEmailBtn' class='updtBtn' value='更新' /></td></tr>" +
        "<tr><td><label>账户密码</label></td><td><input type='password' id='origPasswd' name='origPasswd' disabled='disabled' maxlength='18' /></td>" +
        "<td><input type='button' id='updtPasswdBtn' name='updtPasswdBtn' class='updtBtn' value='更新' /></td></tr></table></form></div>"
    );

    $("#content").find("#secInfoDiv").find("#usrEmail").attr("placeholder", usrInfo["UsrEmail"]);
    $("#content").find("#secInfoDiv").find("#origPasswd").attr("placeholder", "******************");
});

/*学生用户管理*/
$(".usrNav").on("click", "#stdMgt", function () {
    printUsrMgtPanel();

    trgtRole = "std";

    if (usrInfo["UsrRole"] === "tch") {
        $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrType").find("option[value='MjrAbrv']").remove();
        queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, usrInfo["MjrAbrv"], "MjrAbrv");
    } else queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, "", "UsrID");
});

/*教师用户管理*/
$(".usrNav").on("click", "#tchMgt", function () {
    printUsrMgtPanel();

    trgtRole = "tch";

    $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrType").find("option[value='UsrAdms']").remove();
    $("#content").find("#usrMgtDiv").find("#qryUsrBarTbl").find("#qryUsrAnchor").empty().append("教师用户&gt;");

    queryUsrs(usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], trgtRole, "", "UsrID");
});

/*实现打印用户管理面板的函数*/
function printUsrMgtPanel() {
    $("#content").empty();
    $("#content").append(
        "<div id='usrMgtDiv' class='mgtDiv'><form id='usrMgtFrm' name='usrMgtFrm' class='mgtFrm'>" +
        "<table id='qryUsrMenuTbl' class='qryMenuTbl'>" +
        "<tr><td><input type='text' id='qryUsrItem' name='qryUsrItem' class='searchItem' placeholder='请输入待查询的关键词'/></td>" +
        "<td><select id='qryUsrType' name='qryUsrType' class='searchType'></select></td>" +
        "<td><input type='button' id='qryUsrRecsBtn' name='qryUsrRecsBtn' class='searchButton' value='查询' /></td>" +
        "<td><input type='button' id='addRecBtn' name='addRecBtn' class='otherOpBtn' value='新增记录' /></td>" +
        "<td><input type='button' id='impRecsBtn' name='impRecsBtn' class='otherOpBtn' value='批量导入' /></td>" +
        "<td><input type='button' id='delRecsBtn' name='delRecsBtn' class='otherOpBtn' value='批量删除' /></td></tr></table>" +
        "<table id='qryUsrBarTbl' class='qryBarTbl'><tr><td><span><a id='qryUsrAnchor' href='#'>学生用户&gt;</a></span></td></tr></table>" +
        "<div class='qryUsrRecsDiv'><table class='qryRecsLstTbl'></table></div><table id='usrRecsPageCtlTbl' class='recsPageCtlTbl'>" +
        "<tr><td><input type='button' id='prevPage' name='prevPage' class='pageCtlBtn' value='&lt;' /></td><td id='pageOpts'></td>" +
        "<td><input type='button' id='nextPage' name='nextPage' class='pageCtlBtn' value='&gt;' /></td></tr></table></form></div>"
    );

    $("#content").find("#usrMgtDiv").find("#qryUsrMenuTbl").find("#qryUsrType").append(
        "<option value='UsrID'>用户ID</option><option value='UsrName'>姓名</option><option value='UsrGen'>性别</option>" +
        "<option value='UsrAdms'>入学年份</option><option value='MjrAbrv'>所在专业</option>"
    );
}

/*课程查询/管理*/
$(".usrNav").on("click", "#crseQry", function () {
    printCrseMgtPanel();
});

$(".usrNav").on("click", "#crseMgt", function () {
    printCrseMgtPanel();
});

/*实现打印课程管理面板的函数*/
function printCrseMgtPanel() {
    $("#content").empty();
    $("#content").append(
        "<div id='crseMgtDiv' class='mgtDiv'><form id='crseMgtFrm' name='crseMgtFrm' class='mgtFrm'>" +
        "<table id='qryCrseMenuTbl' class='qryMenuTbl'>" +
        "<tr><td><input type='text' id='qryCrseItem' name='qryCrseItem' class='searchItem' placeholder='请输入待查询的关键词'/></td>" +
        "<td><select id='qryCrseType' name='qryCrseType' class='searchType'></select></td>" +
        "<td><input type='button' id='qryCrseRecsBtn' name='qryCrseRecsBtn' class='searchButton' value='查询' /></td>" +
        "<td><input type='button' id='addRecBtn' name='addRecBtn' class='otherOpBtn' value='新增课程' /></td>" +
        "<td><input type='button' id='impRecsBtn' name='impRecsBtn' class='otherOpBtn' value='批量导入' /></td>" +
        "<td><input type='button' id='delRecsBtn' name='delRecsBtn' class='otherOpBtn' value='批量删除' /></td></tr></table>" +
        "<table id='qryCrseBarTbl' class='qryBarTbl'><tr><td><span><a id='qryCrseAnchor' href='#'>课程记录&gt;</a></span></td></tr></table>" +
        "<div class='qryCrseRecsDiv'></div><table id='crseRecsPageCtlTbl' class='recsPageCtlTbl'>" +
        "<tr><td><input type='button' id='prevPage' name='prevPage' class='pageCtlBtn' value='&lt;' /></td><td id='pageOpts'></td>" +
        "<td><input type='button' id='nextPage' name='nextPage' class='pageCtlBtn' value='&gt;' /></td></tr></table></form></div>"
    );

    $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseType").append(
        "<option value='CrseID'>课程ID</option><option value='CrseName'>课程名称</option><option value='UsrID'>课程讲师ID</option>" +
        "<option value='UsrName'>课程讲师姓名</option>"
    );

    if (usrInfo["UsrRole"] === "tch") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseType").find("option[value='UsrName']").remove();
    if (usrInfo["UsrRole"] === "tch") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find("#qryCrseType").find("option[value='UsrID']").remove();

    if (usrInfo["UsrRole"] === "std") $("#content").find("#crseMgtDiv").find("#crseMgtFrm").find("#qryCrseMenuTbl").find(".otherOpBtn").remove();

    queryCrses(usrInfo["UsrID"], usrInfo["UsrRole"], usrInfo["ColgAbrv"], usrInfo["MjrAbrv"], "", "CrseName");
}

/*学生所选课程查询*/
$(".usrNav").on("click", "#schedMgt", function () {
    $("#content").empty();
    $("#content").append(
        "<div id='schedMgtDiv' class='mgtDiv'><form id='schedMgtFrm' name='schedMgtFrm' class='mgtFrm'>" +
        "<table id='qrySchedMenuTbl' class='qryMenuTbl'>" +
        "<tr><td><input type='text' id='qrySchedItem' name='qrySchedItem' class='searchItem' placeholder='请输入待查询的关键词'/></td>" +
        "<td><select id='qrySchedType' name='qrySchedType' class='searchType'></select></td>" +
        "<td><input type='button' id='qrySchedRecsBtn' name='qrySchedRecsBtn' class='searchButton' value='查询' /></td>" +
        "<td><input type='button' id='addRecBtn' name='addRecBtn' class='otherOpBtn' value='新增课程' /></td>" +
        "<td><input type='button' id='impRecsBtn' name='impRecsBtn' class='otherOpBtn' value='批量导入' /></td>" +
        "<td><input type='button' id='delRecsBtn' name='delRecsBtn' class='otherOpBtn' value='批量删除' /></td></tr></table>" +
        "<table id='qrySchedBarTbl' class='qryBarTbl'><tr><td><span><a id='qrySchedAnchor' href='#'>我的课程&gt;</a></span></td></tr></table>" +
        "<div class='qrySchedRecsDiv'></div><table id='schedRecsPageCtlTbl' class='recsPageCtlTbl'>" +
        "<tr><td><input type='button' id='prevPage' name='prevPage' class='pageCtlBtn' value='&lt;' /></td><td id='pageOpts'></td>" +
        "<td><input type='button' id='nextPage' name='nextPage' class='pageCtlBtn' value='&gt;' /></td></tr></table></form></div>"
    );

    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find("#qrySchedType").append(
        "<option value='CrseID'>课程ID</option><option value='CrseName'>课程名称</option><option value='UsrID'>课程讲师ID</option>" +
        "<option value='UsrName'>课程讲师姓名</option>"
    );
    $("#content").find("#schedMgtDiv").find("#schedMgtFrm").find("#qrySchedMenuTbl").find(".otherOpBtn").remove();

    queryScheduleRecs(usrInfo["UsrID"], "", "CrseID");
});

/*退出登录*/
$(".usrNav").on("click", "#logout", function () {
    $.ajax({
        url: "../../library/session/destory_sessn.php",
        type: "POST",
        async: false,
        error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
        success: function () { window.location.href = "../../index.html" }
    });
});