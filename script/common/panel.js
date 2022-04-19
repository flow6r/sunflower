var usrInfo = null;

/*获取登录的用户信息*/
$(document).ready(function () {
    $("#content").empty();
    obtainUserInfo();
    // $("#content").append("<h1 style='color: #2c974b;'>学生电子档案袋系统</h1>");
});

/*实现从会话中获取用户信息的函数*/
function obtainUserInfo() {
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