var usrInfo = null;

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
    $("#nav").find("#usrInfo").after(
        "<li id='stdMgt' name='stdMgt'><label><span>学生管理</span><a href='#'></a></label></li>" +
        "<li id='crseMgt' name='crseMgt'><label><span>课程管理</span><a href='#'></a></label></li>"
    );
    $("#nav").find("#usrInfo").find("#schedMgt").find("span").empty().append("课程管理");
    $("#nav").find("#usrInfo").find("#grpMgt").find("span").empty().append("小组管理");
    $("#nav").find("#usrInfo").find("#achvMgt").find("span").empty().append("成就管理");
}

/*完善管理员用户导航栏*/
function addAdminOpt() {
    $("#nav").find("#usrInfo").after(
        "<li id='usrMgt' name='usrMgt'><label><span>用户管理</span><a href='#'></a></label><ul id='usrMgtSubNav' name='usrMgtSubNav'>" +
        "<li id='stdMgt' name='stdMgt'><label><span style='float: right;'>学生用户</span><a href='#'></a></label></li>" +
        "<li id='tchMgt' name='tchMgt'><label><span style='float: right;'>教师用户</span><a href='#'></a></label></li>" +
        "</ul></li><li id='crseQry' name='crseQry'><label><span>课程查询</span><a href='#'></a></label></li>"
    );
    $("#nav").find("#usrInfo").find("#schedMgt").find("span").empty().append("课程管理");
    $("#nav").find("#usrInfo").find("#grpMgt").find("span").empty().append("小组管理");
    $("#nav").find("#usrInfo").find("#achvMgt").find("span").empty().append("成就管理");
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
        "<tr><td><label>ID</label></td><td><input type='text' id='usrID' name='usrID' disabled='disabled' /></td></tr>" +
        "<tr><td><label>姓名</label></td><td><input type='text' id='usrName' name='usrName' disabled='disabled' /></td></tr>" +
        "<tr><td><label>性别</label></td><td><select id='usrGen' name='usrGen' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='usrAdms' name='usrAdms' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>隶属学院</label></td><td><select id='colgAbrv' name='colgAbrv' disabled='disabled'></select></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='mjrAbrv' name='mjrAbrv' disabled='disabled'></select></td></tr>" +
        "<tr><td><input type='button' id='editBasInfoBtn' name='editBasInfoBtn' value='编辑'/></td>" +
        "<td><input type='button' id='cnlEditInfoBtn' name='cnlEditInfoBtn' value='取消'/>" +
        "<input type='button' id='updtBasInfoBtn' name='updtBasInfoBtn' value='更新'/></td></tr></table></form></div>"
    );

    $("#content").find("#basInfoDiv").find("#usrID").attr("placeholder", usrInfo["UsrID"]);
    $("#content").find("#basInfoDiv").find("#usrID").attr("value", usrInfo["UsrID"]);
    $("#content").find("#basInfoDiv").find("#usrName").attr("placeholder", usrInfo["UsrName"]);
    $("#content").find("#basInfoDiv").find("#usrName").attr("value", usrInfo["UsrName"]);
    $("#content").find("#basInfoDiv").find("#usrGen").append("<option value='" + usrInfo["UsrGen"] + "'>" + (usrInfo["UsrGen"] === "male" ? "男" : "女") + "</option>");
    if (usrInfo["UsrAdms"] != null) {
        let currYear = new Date();
        let yyyy = Number(currYear.getFullYear());
        for (let lower = yyyy - 4; lower <= yyyy; lower++) {
            $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='" + lower + "'>" + lower + "</option>");
        }
        $("#content").find("#basInfoDiv").find("#usrAdms").find("option[value='" + usrInfo["UsrAdms"] + "']").attr("selected", "selected");
    } else $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='null'>暂无</option>");

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
        }
    });
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
})