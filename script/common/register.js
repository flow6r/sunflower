/*检查用户ID完整性*/
$("#regrDiv").on("focusout", "#usrID", function () {
    let usrID = $("#regrDiv").find("#usrID").val();

    if (usrID === "") $("#regrDiv").find("#usrID").attr("placeholder", "请输入用户ID");
    else $("#regrDiv").find("#usrID").removeAttr("placeholder");
});

/*检查姓名完整性*/
$("#regrDiv").on("focusout", "#usrName", function () {
    let usrName = $("#regrDiv").find("#usrName").val();

    if (usrName === "") $("#regrDiv").find("#usrName").attr("placeholder", "请输入姓名");
    else $("#regrDiv").find("#usrName").removeAttr("placeholder");
});

/*检查密码完整性*/
$("#regrDiv").on("focusout", "#usrPasswd", function () {
    let usrPasswd = $("#regrDiv").find("#usrPasswd").val();

    $("#tips").find("span").empty();

    if (usrPasswd === "") {
        $("#tips").attr("style", "visibility: hidden;");
        $("#regrDiv").find("#usrPasswd").attr("placeholder", "请输入密码");
    } else if (usrPasswd.length < 6 || usrPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else {
        $("#tips").attr("style", "visibility: hidden;");
        $("#regrDiv").find("#usrPasswd").removeAttr("placeholder");
    }
});

/*检查密码完整性*/
$("#regrDiv").on("focusout", "#verfPasswd", function () {
    let usrPasswd = $("#regrDiv").find("#usrPasswd").val();
    let verfPasswd = $("#regrDiv").find("#verfPasswd").val();

    $("#tips").find("span").empty();

    if (verfPasswd === "") {
        $("#tips").attr("style", "visibility: hidden;");
        $("#regrDiv").find("#verfPasswd").attr("placeholder", "请重复密码");
    } else if (usrPasswd.length < 6 || usrPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else if (usrPasswd != verfPasswd) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("两次输入的密码不一致");
    } else {
        $("#tips").attr("style", "visibility: hidden;");
        $("#regrDiv").find("#verfPasswd").removeAttr("placeholder");
    }
});

/*追加性别选项*/
$("#regrDiv").on("focusin", "#usrGen", function () {
    $("#regrDiv").find("#usrGen").empty();
    $("#regrDiv").find("#usrGen").append("<option value='male'>男</option><option value='female'>女</option>");
});

/*检查电子邮箱完整性*/
$("#regrDiv").on("focusout", "#usrEmail", function () {
    let usrEmail = $("#regrDiv").find("#usrEmail").val();

    if (usrEmail === "") $("#regrDiv").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
    else $("#regrDiv").find("#usrEmail").removeAttr("placeholder");
});

/*追加入学年份选项*/
$("#regrDiv").on("focusin", "#usrAdms", function () {
    $("#regrDiv").find("#usrAdms").empty();
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("#regrDiv").find("#usrAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
});

/*追加学院选项*/
$("#regrDiv").on("focusin", "#colgAbrv", function () {
    if ($("#regrDiv").find("#colgAbrv").val() == null) {
        $("#regrDiv").find("#colgAbrv").empty();

        $.ajax({
            url: "../../library/common/query_colg.php",
            type: "GET",
            async: false,
            data: { usrRole: "std" },
            dataType: "json",
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (colgJSON) {
                $("#regrDiv").find("#colgAbrv").append("<option value='tips'>请选择学院</option>");
                for (let indx = 0; indx < colgJSON.length; indx++) $("#regrDiv").find("#colgAbrv").append(
                    "<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>"
                );
            }
        });
    }
});

/*追加专业选项*/
$("#regrDiv").on("change", "#colgAbrv", function () {
    let colgAbrv = $("#regrDiv").find("#colgAbrv").val();
    $("#regrDiv").find("#mjrAbrv").empty();

    if (colgAbrv != "tips") {
        $.ajax({
            url: "../../library/common/query_mjr.php",
            type: "GET",
            async: false,
            data: { usrRole: "std", colgAbrv: colgAbrv },
            dataType: "json",
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (mjrJSON) {
                for (let indx = 0; indx < mjrJSON.length; indx++) $("#regrDiv").find("#mjrAbrv").append(
                    "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                );
            }
        });
    }
});

/*返回登录页面*/
$("#regrDiv").on("click", "#back", function () {
    window.location.href = "../../index.html";
});

/*注册学生用户*/
$("#regrDiv").on("click", "#regrBtn", function () {
    let usrID = $("#regrDiv").find("#usrID").val();
    let usrName = $("#regrDiv").find("#usrName").val();
    let usrPasswd = $("#regrDiv").find("#usrPasswd").val();
    let verfPasswd = $("#regrDiv").find("#verfPasswd").val();
    let usrGen = $("#regrDiv").find("#usrGen").val();
    let usrRole = "std";
    let usrEmail = $("#regrDiv").find("#usrEmail").val();
    let usrAdms = $("#regrDiv").find("#usrAdms").val();
    let colgAbrv = $("#regrDiv").find("#colgAbrv").val();
    let mjrAbrv = $("#regrDiv").find("#mjrAbrv").val();

    $("#tips").find("span").empty();

    if (usrID === "" || usrName === "" || usrPasswd === "" ||
        verfPasswd === "" || usrGen === "" || usrEmail === "" ||
        usrAdms === "" || colgAbrv === "" || mjrAbrv === "") {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请完善注册信息");
    } else if (usrPasswd.length < 6 || usrPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else if (usrPasswd != verfPasswd) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("两次输入的密码不一致");
    } else {
        $.ajax({
            url: "../../library/common/create_acct.php",
            type: "POST",
            async: false,
            data: {
                usrID: usrID, usrName: usrName, usrPasswd: usrPasswd,
                usrGen: usrGen, usrRole: usrRole, usrEmail: usrEmail,
                usrAdms: usrAdms, colgAbrv: colgAbrv, mjrAbrv: mjrAbrv
            },
            error: function () { alert("创建用户失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status != "successful") {
                    $("#tips").attr("style", "visibility: visible;");
                    $("#tips").find("span").append(status);
                } else window.location.href = "../../page/panel.html";
            }
        });
    }
});